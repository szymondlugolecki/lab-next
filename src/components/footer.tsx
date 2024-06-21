import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="px-6 py-8 md:px-8 lg:px-12">
      <div className="container flex flex-col items-center justify-between mx-auto md:flex-row">
        <div className="text-center md:text-left">
          <Link href="/" className="text-xl font-bold" prefetch={false}>
            Lab
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            &copy; 2024 Lab. {t("rights")}.
          </p>
        </div>
        <div className="flex mt-4 space-x-4 md:mt-0">
          <Link
            href="/privacy"
            className="text-sm duration-100 hover:text-primary"
            prefetch={false}
          >
            {t("privacy")}
          </Link>
          <Link
            href="/tos"
            className="text-sm duration-100 hover:text-primary"
            prefetch={false}
          >
            {t("terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
