export const runtime = "experimental-edge";

import { auth } from "@/auth";
import { LOCALES } from "@/lib/constants";

import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { localePrefix, pathnames } from "@/i18n/config";

const publicPages = ["/", "/search"];

const intlMiddleware = createIntlMiddleware({
  localePrefix,
  pathnames,
  locales: LOCALES,
  defaultLocale: "en",
});

const authMiddleware = auth((req) => {
  // private routes here
  const session = req.auth;

  if (session) {
    return intlMiddleware(req);
  }
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${LOCALES.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // matcher: ["/((?!api|_next|.*\\..*).*)"],
  matcher: ["/", "/(pl|en)/:path*"],
};
