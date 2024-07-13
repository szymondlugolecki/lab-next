"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ReactNode } from "react";
import { EditArticleInfoForm } from "./edit-article-settings-form";
import { z } from "zod";
import type { ArticleEditInfoSchema } from "@/lib/schemas/article";
import { Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";

export function EditArticleInfoSheet({
  children,
  articleData,
  lang,
}: {
  children: ReactNode;
  articleData: z.infer<ArticleEditInfoSchema>;
  lang: Locale;
}) {
  const t = useTranslations("Article");

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
        {/* <Button variant="outline">Open</Button> */}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("settings.edit_sheet_title")}</SheetTitle>
          <SheetDescription>
            {t("settings.edit_sheet_description")}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <EditArticleInfoForm articleData={articleData} lang={lang} />
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
