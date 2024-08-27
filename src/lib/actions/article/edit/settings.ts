"use server";

import { auth } from "@/lib/auth";
import { LANGUAGES_MAP, LOCALES, Language, Locale } from "@/lib/constants";
import { db } from "@/lib/db";
import { articlesTable } from "@/lib/db/tables/article";
import { octokit } from "@/lib/server/clients";
import { attempt, parseArticleTitle } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// https://github.com/szymondlugolecki/lab-articles.git

import { article$ } from "@/lib/schemas";
import { getPathname } from "@/lib/i18n/navigation";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";
import { moderatorAction } from "@/lib/server/safe-action";

// This action is used to edit article's settings, like:
// title, privacy, category, tags
// Not content tho!
const editArticleSettings = moderatorAction
  .schema(article$.edit().settings)
  .action(async ({ parsedInput }) => {
    const { title, privacy, category, tags, id } = parsedInput;

    const parsedTitle = parseArticleTitle(title);

    // Updating article settings in the database
    const [, updateArticleSettingsError] = await attempt(
      db
        .update(articlesTable)
        .set({ title, parsedTitle, privacy, category, tags })
        .where(eq(articlesTable.id, id))
    );

    if (updateArticleSettingsError) {
      console.error(
        "Error while updating article settings in the database",
        updateArticleSettingsError
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

    const fullUrl = "http://localhost:3000" + "/" + locale + pathname;
    console.log("full url", fullUrl);

    redirect(fullUrl, RedirectType.push);

    // return {
    //   message: "success",
    // };
  });

export default editArticleSettings;
