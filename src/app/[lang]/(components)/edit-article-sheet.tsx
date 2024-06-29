import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Language, Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleEditInfoSchema } from "@/lib/schemas/article";
import edit from "@/lib/actions/article/edit";
import { CategoryCombobox } from "@/components/form/category-combobox";
import { Asterisk } from "@/components/asterisk";
import { SelectUser } from "@/lib/db/tables/user";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  SelectArticle,
  SelectArticleVariant,
  articleVariantsTable,
} from "@/lib/db/tables/article";
import { getTranslations } from "next-intl/server";
import { EditArticleForm } from "./edit-article-form";

// const fetchArticleData = async (variantId: SelectUser["id"]) => {
//   "use server";
//   const result = await db.query.articleVariantsTable.findFirst({
//     where: eq(articleVariantsTable.id, variantId),
//     columns: {
//       id: true,
//       language: true,
//       title: true,
//     },
//     with: {
//       article: {
//         columns: {
//           privacy: true,
//           category: true,
//           tags: true,
//           id: true,
//         },
//       },
//     },
//   });

//   if (!result) {
//     return null;
//   }

//   const articleVariant = {
//     variantId: result.id,
//     language: result.language,
//     title: result.title,
//   };

//   return {
//     ...articleVariant,
//     ...result.article,
//   };
// };

export type EditInfoArticle = Pick<
  SelectArticle,
  "privacy" | "category" | "tags"
> &
  Pick<
    SelectArticleVariant,
    "id" | "language" | "title" | "parsedTitle" | "createdAt"
  >;

export function EditArticleSheet({
  lang,
  children,
  articleData,
}: {
  lang: Language;
  children: React.ReactNode;
  articleData: z.infer<ArticleEditInfoSchema>;
}) {
  const { toast } = useToast();
  const t = useTranslations("Article");
  // const lang = useParams() as Locale
  // const data = await fetchArticleData(articleVariantId);

  return (
    <>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="top" className="h-full">
        <SheetHeader>
          <SheetTitle>Edit article info</SheetTitle>
          <SheetDescription>Make changes to your profile here</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <EditArticleForm lang={lang} defaultValues={articleData} />
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div> */}
        </div>
      </SheetContent>
    </>
  );
}
