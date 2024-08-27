import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Language, Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { CategoryCombobox } from "@/components/form/category-combobox";
import { Asterisk } from "@/components/asterisk";
import { SelectUser } from "@/lib/db/tables/user";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { articlesTable, SelectArticle } from "@/lib/db/tables/article";
import { getTranslations } from "next-intl/server";
import { EditArticleInfoForm } from "../(components)/edit-article-settings-form";

const fetchArticleData = async (parsedTitle: SelectArticle["parsedTitle"]) => {
  const result = await db.query.articlesTable.findFirst({
    where: eq(articlesTable.parsedTitle, parsedTitle),
    columns: {
      id: true,
      language: true,
      title: true,
      privacy: true,
      category: true,
      tags: true,
    },
  });

  if (!result) {
    throw new Error("Article not found");
  }

  return result;
};

export type EditInfoArticle = Pick<
  SelectArticle,
  | "privacy"
  | "category"
  | "tags"
  | "language"
  | "title"
  | "parsedTitle"
  | "createdAt"
>;

export default async function EditArticleInfoPage({
  params,
  searchParams,
}: {
  params: { lang: Locale; title: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = await getTranslations("Article");
  console.log("searchParams", searchParams);
  const articleData = await fetchArticleData(decodeURIComponent(params.title));

  const redirectTo = Array.isArray(searchParams?.redirectTo)
    ? searchParams.redirectTo[0]
    : searchParams?.redirectTo;

  return (
    <div className="p-6">
      <div className="max-w-md">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Edit article settings
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Make changes to the article here.
        </p>
        <div className="grid gap-4 py-4">
          <EditArticleInfoForm articleData={articleData} lang={params.lang} />
        </div>
      </div>
    </div>
  );
}
