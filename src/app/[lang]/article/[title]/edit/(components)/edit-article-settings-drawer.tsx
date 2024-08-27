"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import type { ArticleEditSettingsSchema } from "@/lib/schemas/article";
import { Locale } from "@/lib/constants";
import { useTranslations } from "next-intl";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Settings } from "lucide-react";

export function EditArticleInfoDrawer({ children }: { children: ReactNode }) {
  const t = useTranslations("Article");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-x-1.5"
          size="sm"
        >
          {t("edit_article_settings")}
          <Settings className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("settings.edit_sheet_title")}</DrawerTitle>
          <DrawerDescription>
            {t("settings.edit_sheet_description")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 grid gap-4 py-4">{children}</div>
      </DrawerContent>
    </Drawer>

    // <Sheet>
    //   <SheetTrigger asChild>
    //     {children}
    //   </SheetTrigger>
    //   <SheetContent>
    //     <SheetHeader>
    //       <SheetTitle>{t("settings.edit_sheet_title")}</SheetTitle>
    //       <SheetDescription>
    //         {t("settings.edit_sheet_description")}
    //       </SheetDescription>
    //     </SheetHeader>
    //     <div className="grid gap-4 py-4">
    //       <EditArticleInfoForm articleData={articleData} lang={lang} />
    //     </div>
    //   </SheetContent>
    // </Sheet>
  );
}
