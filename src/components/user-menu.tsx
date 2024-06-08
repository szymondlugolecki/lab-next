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
} from "@heroicons/react/24/outline";
import { MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Link from "next/link";

export function UserMenu({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const { setTheme, theme } = useTheme();

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
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Admin</DropdownMenuLabel>

          {/* rounded-sm px-2 py-1.5 text-sm */}

          <DropdownMenuItem className="p-0">
            <Link
              href="/article/create"
              className="flex items-center gap-x-1.5 w-full px-2 py-1.5"
            >
              <PlusIcon className="w-4 h-4" /> Create New Article
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-x-1.5">
            <UserGroupIcon className="w-4 h-4" />
            User List
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-x-1.5">
              <MoonIcon className="w-4 h-4" />
              Dark Mode
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem className="flex items-center gap-x-1.5">
            <LockOpenIcon className="w-4 h-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
