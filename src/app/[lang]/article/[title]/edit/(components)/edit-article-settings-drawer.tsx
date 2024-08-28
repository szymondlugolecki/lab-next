"use client";

import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
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
  const [isOpen, setOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
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
  );
}
