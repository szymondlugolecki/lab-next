import { Language } from "@/lib/constants";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { eq } from "drizzle-orm";
import React, { useEffect, useMemo, useState } from "react";
import { generateHTML } from "@tiptap/html";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

const getArticleContent = async (title: string, language: Language) => {
  const result = await db.query.articlesTable.findFirst({
    where: eq(articlesTable.parsedTitle, title),
    columns: {
      id: true,
      privacy: true,
      title: true,
      category: true,
      createdAt: true,
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

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: process.env.GH_REPO_OWNER!,
      repo: process.env.GH_REPO_NAME!,
      path: `articles/${language}/${result.id}.json`,
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
  params: { title: string };
}) {
  const { data, error } = await getArticleContent(params.title, "pl");

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
              {/* <input
                placeholder="Title"
                name="title"
                className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
              /> */}
              <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
