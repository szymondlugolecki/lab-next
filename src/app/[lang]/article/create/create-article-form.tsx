"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Language, LANGUAGES, LANGUAGES_MAP } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleCreateSchema } from "@/lib/schemas/article";
import { redirect } from "next/dist/server/api-utils";
import { Link, permanentRedirect, useRouter } from "@/lib/i18n/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Asterisk } from "@/components/asterisk";

export function CreateArticleForm() {
  const { lang } = useParams<{ lang: Language }>();
  const t = useTranslations("Article");
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<ArticleCreateSchema>({
    resolver: zodResolver(article$.create(lang)),
    mode: "onChange",
    defaultValues: {
      title: "",
      language: lang,
    },
  });

  const onSubmit = async ({ title, language }: ArticleCreateSchema) => {
    const result = await createArticle({ title, language });
    const error = result?.data?.error || result?.serverError;
    console.log("result", result);
    if (result?.data?.success) {
      toast("Success");
      router.push({
        pathname: "/article/[title]/edit",
        params: { title: result.data.parsedTitle },
      });
    } else if (error) {
      toast.error(error);
    }

    // permanentRedirect({
    //   pathname: "/article/[title]/edit",
    //   params: { title: response.title },
    // });

    // form.reset();
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
                <input
                  placeholder={t("settings.title_placeholder")}
                  spellCheck={false}
                  className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("settings.title_hints")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("language")}
                <Asterisk />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("settings.language_placeholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LANGUAGES_MAP.map((language, index) => (
                    <SelectItem key={index} value={language.value}>
                      {language.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{t("settings.language_hints")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={lang} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
        >
          {t("content.create_article_button")}
        </Button>
      </form>
    </Form>
  );
}
