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

const articleCreateSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Invalid title",
      required_error: "Title is required",
    })
    .min(3),
});

export function CreateArticleForm() {
  const { lang } = useParams<{ lang: Language }>();
  const { toast } = useToast();
  const t = useTranslations("CreateArticle");

  // 1. Define your form.
  const form = useForm<z.infer<typeof articleCreateSchema>>({
    resolver: zodResolver(articleCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async ({ title }: z.infer<typeof articleCreateSchema>) => {
    await createArticle(lang, { title });
    // console.log("response", response);
    // if (response?.error) {
    //   const { error } = response;
    //   console.log("error", error);
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: typeof error === "string" ? error : error.title,
    //   });
    // } else {
    //   toast({
    //     title: "Success",
    //     description: "Article created!",
    //   });
    //   form.reset();
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {t("create_article")}
        </Button>
      </form>
    </Form>
  );
}
