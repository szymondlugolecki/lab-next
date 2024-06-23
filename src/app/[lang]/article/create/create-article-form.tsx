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

import createArticle from "@/lib/actions/article/create";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Language } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleCreateSchema } from "@/lib/schemas/article";
import { redirect } from "next/dist/server/api-utils";
import { permanentRedirect, useRouter } from "@/lib/i18n/navigation";

export function CreateArticleForm() {
  const { lang } = useParams<{ lang: Language }>();
  const { toast } = useToast();
  const t = useTranslations("CreateArticle");
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<ArticleCreateSchema>>({
    resolver: zodResolver(article$.create(lang)),
    mode: "onChange",
    defaultValues: {
      title: "",
      language: lang,
    },
  });

  const onSubmit = async ({
    title,
    language,
  }: z.infer<ArticleCreateSchema>) => {
    const response = await createArticle({ title, language });
    if (response?.success) {
      router.push({
        pathname: "/article/[title]/update",
        params: { title: response.parsedTitle },
      });
      // permanentRedirect({
      //   pathname: "/article/[title]/update",
      //   params: { title: response.title },
      // });
      toast({
        title: "Success",
        description: "Article created!",
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
              <FormLabel className="select-none">{t("title")}</FormLabel>
              <FormControl>
                <input
                  placeholder={t("title_placeholder")}
                  className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("title_hints")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormControl className="hidden">
                <Input {...field} value={lang} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
        >
          {t("create_article")}
        </Button>
      </form>
    </Form>
  );
}
