"use client";

import { CalendarIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SelectUser } from "@/lib/db/tables/user";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type UserHoverCard = Pick<
  SelectUser,
  "id" | "name" | "email" | "image" | "role" | "createdAt"
>;

export function UserHoverCard({ user }: { user: UserHoverCard }) {
  const t = useTranslations();
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // console.log("user.image", user.image);

  return (
    <HoverCard>
      <HoverCardTrigger asChild className="text-inherit">
        <Button variant="link">{user.name}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-x-4">
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user.name}</h4>
            <p className="text-sm">{user.email}</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {t("UserMenu.user_joined", { date: user.createdAt })}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
