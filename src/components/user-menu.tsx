"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LockOpenIcon,
  PlusIcon,
  UserGroupIcon,
  UserIcon,
  LanguageIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import ReactCountryFlag from "react-country-flag";

export function UserMenu({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const { setTheme, theme } = useTheme();
  const t = useTranslations("UserMenu");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const [createArticleDialogOpen, setCreateArticleDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="select-none">
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-x-1.5">
            <UserIcon className="w-4 h-4" />
            {t("profile")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <Link
              href="/article/create"
              className="flex items-center gap-x-1.5 w-full px-2 py-1.5"
            >
              <PlusIcon className="w-4 h-4" /> {t("create_new_article")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Link
              href="/admin/users"
              className="flex items-center gap-x-1.5 w-full px-2 py-1.5"
            >
              <UserGroupIcon className="w-4 h-4" /> {t("user_list")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Link
              href="/admin/articles"
              className="flex items-center gap-x-1.5 w-full px-2 py-1.5"
            >
              <DocumentIcon className="w-4 h-4" /> {t("article_list")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-x-1.5">
              <LanguageIcon className="w-4 h-4" />
              {t("language")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    // @ts-ignore
                    router.replace({ pathname, params }, { locale: "pl" });
                  }}
                >
                  <ReactCountryFlag countryCode="PL" svg className="mr-1.5" />{" "}
                  Polski
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // @ts-ignore
                    router.replace({ pathname, params }, { locale: "en" });
                  }}
                >
                  <ReactCountryFlag countryCode="GB" svg className="mr-1.5" />{" "}
                  English
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-x-1.5">
              <MoonIcon className="w-4 h-4" />
              {t("dark_mode")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  {t("dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  {t("light")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  {t("system")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem className="flex items-center gap-x-1.5">
            <LockOpenIcon className="w-4 h-4" />
            {t("log_out")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
