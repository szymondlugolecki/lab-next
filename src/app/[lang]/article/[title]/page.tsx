import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { octokit } from "@/lib/server/clients";
import { and, eq } from "drizzle-orm";
import { generateHTML } from "@tiptap/html";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { attempt, getArticlePath, isModerator } from "@/lib/utils";
import { articlesTable } from "@/lib/db/tables/article";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { Pencil } from "lucide-react";
import { auth } from "@/lib/auth";
import Emoji, { gitHubEmojis } from "@tiptap-pro/extension-emoji";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";

const getArticleContent = async (title: string) => {
  const result = await db.query.articlesTable.findFirst({
    where: eq(articlesTable.parsedTitle, title),
    columns: {
      id: true,
      title: true,
      createdAt: true,
      privacy: true,
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
  });
  if (!result) {
    return {
      error: "Article not found",
    };
  }

  console.log("path", getArticlePath(result.id));

  const [article, fetchArticleError] = await attempt(
    octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: process.env.GH_REPO_OWNER!,
      repo: process.env.GH_REPO_NAME!,
      path: getArticlePath(result.id),
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
  );

  if (fetchArticleError) {
    console.error("Error while fetching article", fetchArticleError);
    return {
      error: "Error while fetching article",
    };
  }

  // @ts-ignore
  const contentBase64: string = article.data.content;
  const contentStringified = Buffer.from(contentBase64, "base64").toString(
    "utf-8"
  );
  const contentParsed = JSON.parse(contentStringified);
  const isDocumentEmpty =
    !contentParsed ||
    (Array.isArray(contentParsed) && contentParsed.length === 0);
  const document = isDocumentEmpty
    ? { type: "doc", content: [] }
    : contentParsed;

  return {
    data: {
      title: result.title,
      content: sanitizeHtml(
        generateHTML(document, [
          StarterKit,
          Document,
          Heading,
          Paragraph,
          Text,
          Bold,
          Emoji.configure({
            emojis: gitHubEmojis,
            enableEmoticons: true,
          }),
          TiptapLink,
        ])
      ),
    },
  };
};

export default async function ArticlePage({
  params,
}: {
  params: { title: string; lang: Language };
}) {
  const session = await auth();
  const parsedTitle = decodeURIComponent(params.title);
  const { data, error } = await getArticleContent(parsedTitle);

  if (!data) {
    return <div>{error}</div>;
  }

  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-5 focus:outline-none">
              <div className="flex items-start gap-x-1">
                <h1>{data.title}</h1>
                {session?.user.role && isModerator(session.user.role) ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2.5 min-w-[36px] h-9"
                    asChild
                  >
                    <Link
                      href={{
                        pathname: "/article/[title]/edit",
                        params: { title: parsedTitle },
                      }}
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                  </Button>
                ) : null}
              </div>
              <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
