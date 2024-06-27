import en from "../i18n/dictionares/en.json";
import type { AdminTableArticle } from "@/app/[lang]/admin/articles/(components)/columns";
import type { Keys, Formatter } from "./index";
import "@tanstack/react-table";
// import pl from "../i18n/dictionares/pl.json";

type Messages = typeof en;

declare module "@tanstack/react-table" {
  interface TableMeta {
    t: (key: Keys) => string;
    f: Formatter;
  }
}

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
