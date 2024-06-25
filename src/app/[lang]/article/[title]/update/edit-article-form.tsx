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

import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleUpdateInfoSchema } from "@/lib/schemas/article";
import edit from "@/lib/actions/article/edit";
import { CategoryCombobox } from "@/components/form/category-combobox";
import { Asterisk } from "@/components/asterisk";

export function EditArticleForm({
  defaultValues,
}: {
  defaultValues?: z.infer<ArticleUpdateInfoSchema>;
}) {
  const { lang } = useParams<{ lang: Locale; title: string }>();
  const { toast } = useToast();
  const t = useTranslations("Article");

  // 1. Define your form.
  const form = useForm<z.infer<ArticleUpdateInfoSchema>>({
    resolver: zodResolver(article$.update(lang).info),
    mode: "onChange",
    defaultValues,
  });

  const onSubmit = async (data: z.infer<ArticleUpdateInfoSchema>) => {
    const response = await edit(data);
    if (response?.success) {
      toast({
        title: "Success",
        description: "Edited article info!",
      });
      // form.reset();
    } else {
      const { error } = response;
      console.log("error", error);
      const parsedError = error
        ? typeof error === "string"
          ? error
          : error.title
        : "Unexpected error";
      toast({
        variant: "destructive",
        title: "Error",
        description: parsedError,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, console.error)}
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
              <FormDescription>{t("info.title_hints")}</FormDescription>
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {t("info.save_changes")}
        </Button>
      </form>
    </Form>
  );
}
