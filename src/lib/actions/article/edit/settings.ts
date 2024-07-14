"use server";

import { auth } from "@/lib/auth";
import { LANGUAGES_MAP, LOCALES, Language, Locale } from "@/lib/constants";
import { db } from "@/lib/db";
import { articleVariantsTable, articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import {
  attempt,
  extractTextFromJSON,
  getArticlePath,
  getLanguageFromLocale,
  parseArticleTitle,
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ArticleEditInfoSchema } from "@/lib/schemas/article";

// https://github.com/szymondlugolecki/lab-articles.git

import { article$ } from "@/lib/schemas";
import { getPathname } from "@/lib/i18n/navigation";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";

export default async function editSettings(
  data: z.infer<ArticleEditInfoSchema>
) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const result = article$.edit().settings.safeParse(data);
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { title, privacy, category, tags, variantId } = result.data;

  const articleVariant = await db.query.articleVariantsTable.findFirst({
    where: eq(articleVariantsTable.id, variantId),
    columns: {
      articleId: true,
    },
  });
  if (!articleVariant) {
    return {
      error: "Article not found",
    };
  }

  const parsedTitle = parseArticleTitle(title);

  // Updating article settings in the database
  const [, dbUpdateError] = await attempt(
    db.batch([
      db
        .update(articleVariantsTable)
        .set({ title, parsedTitle })
        .where(eq(articleVariantsTable.id, variantId)),
      db
        .update(articlesTable)
        .set({ privacy, category, tags })
        .where(eq(articlesTable.id, articleVariant.articleId)),
    ])
  );

  if (dbUpdateError) {
    console.error(
      "Error while updating article settings in the database",
      dbUpdateError
    );
    return {
      error: "Error while updating settings in the database",
    };
  }

  // Revalidating the article page
  revalidatePath("/article/[title]", "layout");
  revalidatePath("/admin/articles");

  // return {
  //   success: true,
  // };

  // Testing
  // This still doesn't work properly
  // The redirection is not working because it is caught in a try/catch block
  // In the handleSubmit function

  console.log("redirecting", {
    pathname: "localhost:3000" + "/article/[title]",
    title: parsedTitle,
  });

  const forwardedHost = headers().get("X-Forwarded-Host");
  const locale = (await getLocale()) as Locale;
  const pathname = getPathname({
    href: {
      pathname: "/article/[title]/edit",
      params: { title: parsedTitle },
    },
    locale,
  });
  console.log("forwardedHost", forwardedHost);
  console.log("getLocale", locale);
  console.log("pathname", pathname);

  if (!forwardedHost) {
    notFound();
  }

  const fullUrl = forwardedHost + "/" + locale + pathname;
  console.log("full url", fullUrl);

  redirect(fullUrl, RedirectType.push);
}
