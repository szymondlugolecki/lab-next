import { UserMenu } from "./user-menu";
import type { Session } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export async function Header() {
  const session = await auth();
  // console.log("/header - user", session?.user);
  const t = await getTranslations("Header");

  return (
    <header className="bg-card px-6 py-4 text-card-foreground md:px-8 lg:px-12">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold" prefetch={false}>
          Lab
        </Link>
        <div className="flex items-center gap-x-6">
          <nav className="hidden gap-x-6 text-sm md:flex">
            <Link
              href="/"
              className="duration-100 hover:text-primary"
              prefetch={false}
            >
              {t("home")}
            </Link>

            <Link
              href="/search"
              className="flex gap-x-1 items-center duration-100 hover:text-primary"
              prefetch={false}
            >
              <MagnifyingGlassIcon className="h-[18px] w-[18px] text-primary" />
              {t("search")}
            </Link>
          </nav>
          {session?.user ? (
            <UserMenu name={session.user.name}>
              {session.user.name.split(" ")[0]}
            </UserMenu>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button
                variant="secondary"
                className="rounded-md px-4 py-2"
                type="submit"
              >
                {t("signin")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
