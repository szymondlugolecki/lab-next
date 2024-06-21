import { LOCALES } from "../constants";
import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { pathnames, localePrefix } from "./config";

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
  permanentRedirect,
} = createLocalizedPathnamesNavigation({
  locales: LOCALES,
  pathnames,
  localePrefix,
});
