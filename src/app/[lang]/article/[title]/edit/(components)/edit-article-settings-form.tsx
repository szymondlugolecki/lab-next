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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import {
  LANGUAGES_MAP,
  Locale,
  PRIVACY,
  PRIVACY_MAP,
  TAGS_MAP,
} from "@/lib/constants";
import { useTranslations } from "next-intl";
import { article$ } from "@/lib/schemas";
import { ArticleEditSettingsSchema } from "@/lib/schemas/article";
import editArticleSettings from "@/lib/actions/article/edit/settings";
import { Asterisk } from "@/components/asterisk";
import { SelectArticle } from "@/lib/db/tables/article";
import { toast } from "sonner";
import { useRouter } from "@/lib/i18n/navigation";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { TagsCombobox } from "@/components/form/tags-combobox";
import { Badge } from "@/components/ui/badge";

export type EditInfoArticle = Pick<
  SelectArticle,
  "privacy" | "tags" | "language" | "title" | "parsedTitle" | "createdAt"
>;

export function EditArticleSettingsForm({
  articleData,
  lang,
}: {
  articleData: ArticleEditSettingsSchema;
  lang: Locale;
}) {
  const t = useTranslations("Article");
  const router = useRouter();

  const form = useForm<ArticleEditSettingsSchema>({
    resolver: zodResolver(article$.edit(lang).settings),
    mode: "onChange",
    defaultValues: articleData,
  });

  const tags = form.watch().tags || [];

  const onSubmit = async (data: ArticleEditSettingsSchema) => {
    const result = await editArticleSettings(data);
    const error = result?.data?.error || result?.serverError;
    console.log("error", error);
    if (error) {
      toast.error(error);
    } else if (result?.data?.parsedTitle) {
      toast("Success");
      router.push({
        pathname: "/article/[title]/edit",
        params: {
          title: result.data.parsedTitle,
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="space-y-8"
      >
        {/* Title Input */}
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

        {/* Privacy Select */}
        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Privacy
                <Asterisk />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy settings" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRIVACY_MAP.map(({ key, value }) => (
                    <SelectItem value={value} key={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Public - visible to everyone; Restricted - only logged in users
                can see; Private - only the admin, mod, users with access can
                see
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language Select */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Language
                <Asterisk />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LANGUAGES_MAP.map(({ key, value }) => (
                    <SelectItem value={value} key={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The language that this article is written in
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        {/* <CategoryCombobox form={form} /> */}

        {/* Tags Combobox */}
        <div className="grid gap-y-4">
          <TagsCombobox form={form} />
          <div className="grid grid-cols-[repeat(auto-fill,120px)] gap-2">
            {tags.map((tag) => (
              <Badge variant="secondary" key={tag} className="relative py-1">
                {TAGS_MAP.find((t) => t.value === tag)?.key}
                <button
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "tags",
                      tags.filter((t) => t !== tag)
                    )
                  }
                  className="right-[6px] rounded-full top-[calc(50%-1px)] -translate-y-1/2 absolute hover:bg-muted"
                >
                  x
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Id (Hidden field) */}
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

        <DrawerFooter>
          <div className="flex gap-x-3 justify-end">
            <DrawerClose asChild>
              <Button variant="outline" className="grow">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              Reset
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {t("settings.save_changes")}
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Form>
  );
}
