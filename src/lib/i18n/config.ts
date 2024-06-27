import { LocalePrefix, Pathnames } from "next-intl/routing";
import type { Locale } from "../constants";

export const localePrefix = {
  mode: "always",
} satisfies LocalePrefix<Locale[]>;

// The `pathnames` object holds pairs of internal and
// external paths. Based on the locale, the external
// paths are rewritten to the shared, internal ones.
export const pathnames = {
  // If all locales use the same pathname, a single
  // external path can be used for all locales
  "/": "/",
  "/search": {
    en: "/search",
    pl: "/szukaj",
  },
  "/user/[id]/articles": {
    en: "/user/[id]/articles",
    pl: "/uzytkownik/[id]/artykuly",
  },
  "/user/[id]/comments": {
    en: "/user/[id]/comments",
    pl: "/uzytkownik/[id]/komentarze",
  },
  "/admin/users": {
    en: "/admin/users",
    pl: "/admin/uzytkownicy",
  },
  "/admin/articles": {
    en: "/admin/articles",
    pl: "/admin/artykuly",
  },
  "/article/create": {
    en: "/article/create",
    pl: "/artykul/stworz",
  },
  "/article/[title]": {
    en: "/article/[title]",
    pl: "/artykul/[title]",
  },
  "/article/[title]/update": {
    en: "/article/[title]/update",
    pl: "/artykul/[title]/zaktualizuj",
  },
  "/privacy": {
    en: "/privacy",
    pl: "/polityka-prywatnosci",
  },
  "/tos": {
    en: "/tos",
    pl: "/zasady-uzytkowania",
  },
  // /article/${parsedTitle}/update
  // If locales use different paths, you can
  // specify each external path per locale
  // '/about': {
  //   en: '/about',
  //   pl: '/ueber-uns'
  // },

  // Dynamic params are supported via square brackets
  // '/news/[articleSlug]-[articleId]': {
  //   en: '/news/[articleSlug]-[articleId]',
  //   de: '/neuigkeiten/[articleSlug]-[articleId]'
  // },

  // Static pathnames that overlap with dynamic segments
  // will be prioritized over the dynamic segment
  // '/news/just-in': {
  //   en: '/news/just-in',
  //   de: '/neuigkeiten/aktuell'
  // },

  // Also (optional) catch-all segments are supported
  // '/categories/[...slug]': {
  //   en: '/categories/[...slug]',
  //   de: '/kategorien/[...slug]'
  // }
} satisfies Pathnames<Locale[]>;

const exports = {
  localePrefix,
  pathnames,
};

export default exports;
