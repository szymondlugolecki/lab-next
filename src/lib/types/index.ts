import type { createFormatter, useFormatter, useTranslations } from "next-intl";

export type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
          DotNestedKeys<T[K]>
        >}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

export type Keys = DotNestedKeys<IntlMessages>;
export type Formatter = ReturnType<typeof createFormatter>;
