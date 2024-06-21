import en from "../i18n/dictionares/en.json";
// import pl from "../i18n/dictionares/pl.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
