"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { Input } from "@/components/ui/input";
import { Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleEditSettingsSchema } from "@/lib/schemas/article";
import editArticleSettings from "@/lib/actions/article/edit/settings";
import { CategoryCombobox } from "@/components/form/category-combobox";
import { Asterisk } from "@/components/asterisk";
import { SelectArticle } from "@/lib/db/tables/article";
import { toast } from "sonner";

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

export function EditArticleSettingsForm({
  articleData,
  lang,
}: {
  articleData: ArticleEditSettingsSchema;
  lang: Locale;
}) {
  const t = useTranslations("Article");

  const form = useForm<ArticleEditSettingsSchema>({
    resolver: zodResolver(article$.edit(lang).settings),
    mode: "onChange",
    defaultValues: articleData,
  });

  const onSubmit = async (data: ArticleEditSettingsSchema) => {
    const result = await editArticleSettings(data);
    const error = result?.data?.error || result?.serverError;
    console.log("error", error);
    if (error) {
      toast.error(error);
    } else {
      toast("Success");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="space-y-8"
      >
        {/* Title */}
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
                <Input {...field} spellCheck={false} />
              </FormControl>
              <FormDescription>{t("settings.title_hints")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <CategoryCombobox form={form} />

        {/* Article Id */}
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl className="hidden">
                <Input {...field} value={articleData.id} />
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
