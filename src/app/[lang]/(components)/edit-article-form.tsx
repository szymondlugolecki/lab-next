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
import { useParams } from "next/navigation";
import { Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleEditInfoSchema } from "@/lib/schemas/article";
import edit from "@/lib/actions/article/edit";
import { CategoryCombobox } from "@/components/form/category-combobox";
import { Asterisk } from "@/components/asterisk";
import { SelectUser } from "@/lib/db/tables/user";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { articleVariantsTable } from "@/lib/db/tables/article";
import { EditInfoArticle } from "./edit-article-sheet";

export function EditArticleForm({
  lang,
  defaultValues,
}: {
  lang: Locale;
  defaultValues: z.infer<ArticleEditInfoSchema>;
}) {
  const { toast } = useToast();
  const t = useTranslations("Article");

  // 1. Define your form.
  const form = useForm<z.infer<ArticleEditInfoSchema>>({
    resolver: zodResolver(article$.edit(lang).info),
    mode: "onChange",
    defaultValues,
  });

  const onSubmit = async (data: z.infer<ArticleEditInfoSchema>) => {
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

  //   <div className="grid gap-4 py-4">
  //     <div className="grid grid-cols-4 items-center gap-4">
  //       <Label htmlFor="name" className="text-right">
  //         Name
  //       </Label>
  //       <Input id="name" value="Pedro Duarte" className="col-span-3" />
  //     </div>
  //     <div className="grid grid-cols-4 items-center gap-4">
  //       <Label htmlFor="username" className="text-right">
  //         Username
  //       </Label>
  //       <Input id="username" value="@peduarte" className="col-span-3" />
  //     </div>
  //   </div>

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

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {t("info.save_changes")}
            </Button>
          </SheetClose>
        </SheetFooter>

        {/* <Button type="submit"  disabled={form.formState.isSubmitting}>
        {t("info.save_changes")}
        </Button> */}
      </form>
    </Form>
  );
}
