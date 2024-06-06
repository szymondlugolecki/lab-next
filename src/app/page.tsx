import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { auth, signIn } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <section className="grid grid-cols-2 gap-x-8">
          <div>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button type="submit">Sign in with Google</Button>
            </form>
          </div>

          <div className="flex flex-col gap-y-5">
            <p>Session user: {session?.user ? session?.user.email : "null"}</p>
            {session?.user && <UserMenu>{session?.user.name}</UserMenu>}
          </div>

          <div className="p-4">
            <ModeToggle />
          </div>
        </section>
      </div>
    </main>
  );
}
