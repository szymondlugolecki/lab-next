import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export async function Header() {
  const session = await auth();
  console.log("/header - user", session?.user);

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
              Home
            </Link>

            <Link
              href="/search"
              className="flex gap-x-1 items-center duration-100 hover:text-primary"
              prefetch={false}
            >
              <MagnifyingGlassIcon className="h-[18px] w-[18px] text-primary" />
              Search
            </Link>
          </nav>
          {session?.user ? (
            <UserMenu name={session.user.name}>
              {session.user.name.split(" ")[0]}
            </UserMenu>
          ) : (
            <Button
              variant="secondary"
              className="rounded-md px-4 py-2"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
