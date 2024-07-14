"use client";

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
import { redirect, useParams } from "next/navigation";
import { Language, Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleEditInfoSchema } from "@/lib/schemas/article";
import editArticleSettings from "@/lib/actions/article/edit/settings";
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

export type EditInfoArticle = Pick<
  SelectArticle,
  "privacy" | "category" | "tags"
> &
  Pick<
    SelectArticleVariant,
    "id" | "language" | "title" | "parsedTitle" | "createdAt"
  >;

export function EditArticleInfoForm({
  articleData,
  lang,
}: {
  articleData: z.infer<ArticleEditInfoSchema>;
  lang: Locale;
}) {
  const t = useTranslations("Article");
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<ArticleEditInfoSchema>>({
    resolver: zodResolver(article$.edit(lang).settings),
    mode: "onChange",
    defaultValues: articleData,
  });

  const onSubmit = async (data: z.infer<ArticleEditInfoSchema>) => {
    console.log("data", { ...articleData, ...data });
    const response = await editArticleSettings({ ...articleData, ...data });
    // console.log("response", response);
    // if (response?.success) {
    //   toast({
    //     title: "Success",
    //     description: "Edited article settings!",
    //   });
    //   // form.reset();
    // } else {
    //   const { error } = response;
    //   console.log("error", error);
    //   const parsedError = error
    //     ? typeof error === "string"
    //       ? error
    //       : error.title
    //     : "Unexpected error";
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: parsedError,
    //   });
    // }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="select-none">
                {t("title")}
                <Asterisk />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("settings.title_hints")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CategoryCombobox form={form} />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormControl className="hidden">
                <Input {...field} value={lang} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-x-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t("settings.save_changes")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
