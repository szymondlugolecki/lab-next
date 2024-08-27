export const runtime = "experimental-edge";

import { auth } from "@/auth";
import { LOCALES } from "@/lib/constants";

import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { localePrefix, pathnames } from "@/i18n/config";
import { isModerator } from "./lib/utils";

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

  // Protection against unauthorized access to admin panel
  const { role } = session?.user || {};
  console.log(session?.user.name, session?.user.role);
  const ownerEmail = process.env.OWNER_EMAIL;
  console.log("ownerEmail", session?.user.email, ownerEmail);
  if (RegExp(`^(/(${LOCALES.join("|")}))\/admin`).test(req.nextUrl.pathname)) {
    if (session?.user.email !== ownerEmail) {
      if (!role || !isModerator(role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

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
  matcher: ["/((?!api|_next|.*\\..*).*)"], //["/", "/(pl|en)/:path*"],
};
