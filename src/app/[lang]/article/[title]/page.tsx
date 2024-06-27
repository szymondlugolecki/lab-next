import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { and, eq } from "drizzle-orm";
import { generateHTML } from "@tiptap/html";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { getArticlePath } from "@/lib/utils";

const getArticleContent = async (title: string, language: Language) => {
  const result = await db.query.articleVariantsTable.findFirst({
    where: and(
      eq(articleVariantsTable.parsedTitle, title),
      eq(articleVariantsTable.language, language)
    ),
    columns: {
      id: true,
      title: true,
      createdAt: true,
    },
    with: {
      article: {
        columns: {
          privacy: true,
          category: true,
        },
        with: {
          allowedUsers: {
            columns: {
              userId: true,
            },
          },
          blockedUsers: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });
  if (!result) {
    return {
      error: "Article not found",
    };
  }

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: process.env.GH_REPO_OWNER!,
      repo: process.env.GH_REPO_NAME!,
      path: getArticlePath(result.id, language),
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // @ts-ignore
  const contentBase64: string = response.data.content;
  const contentStringified = Buffer.from(contentBase64, "base64").toString(
    "utf-8"
  );
  const contentParsed = JSON.parse(contentStringified);
  //   console.log("contentBase64", contentBase64);
  //   console.log("contentStringified", contentStringified);
  const document = { type: "doc", content: contentParsed };
  console.log("contentParsed", contentParsed);
  console.log("document", document);

  return {
    data: {
      title: result.title,
      content: sanitizeHtml(
        generateHTML(document, [Document, Paragraph, Text, Bold])
      ),
    },
  };
};

export default async function Article({
  params,
}: {
  params: { title: string; lang: Language };
}) {
  console.log("params", params);
  const { data, error } = await getArticleContent(params.title, params.lang);

  if (!data) {
    return <div>{error}</div>;
  }

  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-5 focus:outline-none">
              <h1>{data.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
