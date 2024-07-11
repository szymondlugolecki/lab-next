"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  COUNTRY_CODES_MAP,
  Category,
  Language,
  Privacy,
  ROLES,
  Role,
} from "@/lib/constants";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AdminTableArticle = Pick<
  SelectArticle,
  "id" | "privacy" | "category" | "tags"
> &
  Pick<
    SelectArticleVariant,
    "language" | "title" | "parsedTitle" | "createdAt"
  > & { variantId: SelectArticleVariant["id"] } & {
    author: Pick<
      SelectUser,
      "id" | "email" | "image" | "name" | "role" | "createdAt"
    >;
  };

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/lib/i18n/navigation";
import {
  SelectArticle,
  SelectArticleVariant,
  articleVariantsTable,
} from "@/lib/db/tables/article";
import { SelectUser } from "@/lib/db/tables/user";
import ReactCountryFlag from "react-country-flag";
import { UserHoverCard } from "@/app/[lang]/(components)/user-hover-card";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { EditArticleSheet } from "@/app/[lang]/(components)/edit-article-sheet";
import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";

export const columns: ColumnDef<AdminTableArticle>[] = [
  {
    id: "select",
    size: 30,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label={table.options.meta?.t("Table.select_all")}
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label={table.options.meta?.t("Table.select_row")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row, table }) => {
      const article = row.original;

      return (
        <Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {table.options.meta?.t("Table.open_menu")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {table.options.meta?.t("Table.articles.menu_actions")}
              </DropdownMenuLabel>

              {/* Copy Article Id */}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(article.id)}
              >
                {table.options.meta?.t("Table.articles.copy_article_id")}
              </DropdownMenuItem>

              {/* View Article */}
              <DropdownMenuItem className="p-0">
                <Link
                  href={{
                    pathname: "/article/[title]",
                    params: { title: article.parsedTitle },
                  }}
                  className="w-full px-2 py-1.5"
                >
                  {table.options.meta?.t("Table.articles.view_article")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Edit Article Info */}
              {/* <EditArticleSheet
                articleData={article}
                lang={table.options.meta?.lang as Language}
              >
                <DropdownMenuItem className="p-0">
                <button className="w-full px-2 py-1.5 hover:bg-muted relative flex select-none items-center rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                  {table.options.meta?.t("Table.articles.edit_article_info")}
                </button>
                </DropdownMenuItem>
              </EditArticleSheet> */}

              <DropdownMenuItem className="p-0">
                <Link
                  href={{
                    pathname: "/article/[title]/edit/info",
                    params: { title: article.parsedTitle },
                    query: {
                      redirectTo: "/admin/articles",
                    },
                  }}
                  className="w-full px-2 py-1.5"
                >
                  {table.options.meta?.t("Table.articles.edit_article_info")}
                </Link>
              </DropdownMenuItem>

              {/* Edit Article Content */}
              <DropdownMenuItem className="p-0">
                <Link
                  href={{
                    pathname: "/article/[title]/edit/content",
                    params: { title: article.parsedTitle },
                  }}
                  className="w-full px-2 py-1.5"
                >
                  {table.options.meta?.t("Table.articles.edit_article_content")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Sheet>
      );
    },
  },
  {
    id: "language",
    accessorKey: "language",
    size: 16,
    minSize: 16,
    header: () => null,
    cell: ({ getValue }) => {
      const lang = getValue<Language>();

      const country = COUNTRY_CODES_MAP.find(({ key }) => key === lang);
      // console.log("country", country);

      if (!country) return null;

      return (
        <ReactCountryFlag
          countryCode={country.value}
          svg
          className="mr-1.5 min-w-4"
        />
      );
    },
    enableSorting: false,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column, table }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {table.options.meta?.t("Table.articles.title")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return <p className="font-medium">{getValue<string>()}</p>;
    },
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column, table }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {table.options.meta?.t("Table.articles.category")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue, table }) => {
      const category = getValue<Category>();
      return <p>{table.options.meta?.t(`Categories.${category}`)}</p>;
    },
  },
  {
    id: "privacy",
    accessorKey: "privacy",
    header: ({ column, table }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {table.options.meta?.t("Table.articles.privacy")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue, table }) => {
      const privacy = getValue<Privacy>();
      return <p>{table.options.meta?.t(`Privacy.${privacy}`)}</p>;
    },
  },
  {
    accessorKey: "author",
    header: ({ column, table }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {table.options.meta?.t("Table.articles.author")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const author = row.getValue("author") as AdminTableArticle["author"];

      // return <div className="">{author.name}</div>;

      return <UserHoverCard user={author} />;
    },
  },
  {
    accessorKey: "createdAt",

    header: ({ column, table }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {table.options.meta?.t("Table.articles.created_at")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const createdAt = row.getValue("createdAt") as Date;

      const formatter = table.options.meta?.f;

      const dateShort = formatter?.dateTime(createdAt, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const dateLong = formatter?.dateTime(createdAt, {
        hour: "numeric",
        minute: "numeric",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      return (
        <div className="text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="">{dateShort}</TooltipTrigger>
              <TooltipContent>
                <p>{dateLong}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
