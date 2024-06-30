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
import { Language, ROLES, Role } from "@/lib/constants";
import { SelectUser } from "@/lib/db/tables/user";

import { createTranslator, createFormatter } from "next-intl";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AdminTableUser = Pick<
  SelectUser,
  "id" | "email" | "name" | "role" | "image" | "createdAt"
>;

// export type Article = {
//   id: string;
//   title: string;
//   privacy: Privacy;
//   author: string;
//   createdAt: string;
// };

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { cn, getURLFriendlyEmail } from "@/lib/utils";
import { Link } from "@/lib/i18n/navigation";
import changeRole from "@/lib/actions/article/users/changeRole";
import approve from "@/lib/actions/article/users/approve";

// type ColumnDefWithI18n = ColumnDef<AdminTableUser> & {
//     options: {
//         meta: {
//           t: ReturnType<typeof createTranslator>;
//         };
//       };
// };

// HeaderContext<AdminTableUser, unknown>.table:

export const columns: ColumnDef<AdminTableUser>[] = [
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
      const user = row.original;

      return (
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
              {table.options.meta?.t("Table.users.menu_actions")}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              {table.options.meta?.t("Table.users.copy_user_id")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {table.options.meta?.t("Table.users.change_role")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {ROLES.map((role, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <button
                        className={cn(
                          "w-full",
                          role === user.role && "bg-muted text-muted-foreground"
                        )}
                        disabled={role === user.role}
                        onClick={async () => {
                          console.log("clicked");
                          const result = await changeRole({
                            id: user.id,
                            role,
                          });
                          console.log("result", result);
                        }}
                      >
                        {table.options.meta?.t(`Roles.${role}`)}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              className={cn(
                "text-green-400 hidden",
                user.role === "awaiting-approval" && "block"
              )}
              asChild
            >
              <button
                className="w-full"
                onClick={async () => {
                  console.log("clicked");
                  const result = await approve({
                    ids: [user.id],
                  });
                  console.log("result", result);
                }}
              >
                {table.options.meta?.t("Table.users.approve")}
              </button>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="p-0">
              <Link
                href={{
                  pathname: "/user/[id]/articles",
                  params: { id: user.id },
                }}
                className="w-full px-2 py-1.5"
              >
                {table.options.meta?.t("Table.users.view_articles")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href={{
                  pathname: "/user/[id]/comments",
                  params: { id: user.id },
                }}
                className="w-full px-2 py-1.5"
              >
                {table.options.meta?.t("Table.users.view_comments")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "image",
    size: 50,
    header: () => null,
    cell: ({ row }) => {
      const image = row.getValue("image") as string;

      return (
        <div>
          <Image
            src={image}
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column, table }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {table.options.meta?.t("Table.users.name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column, table }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {table.options.meta?.t("Table.users.role")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const role = row.getValue("role") as Role;

      return <div className="">{table.options.meta?.t(`Roles.${role}`)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ table }) => (
      <div className="text-right">
        {table.options.meta?.t("Table.users.joined")}
      </div>
    ),
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
