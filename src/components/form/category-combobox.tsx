"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

import { CATEGORIES_MAP, Category } from "@/lib/constants";
import { ArticleUpdateInfoSchema } from "@/lib/schemas/article";
import { useTranslations } from "next-intl";
import React from "react";
import { Asterisk } from "../asterisk";

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
// ]

const categories = CATEGORIES_MAP.map(({ value, key }) => ({
  value,
  label: key,
}));

type FormReturn = z.infer<ArticleUpdateInfoSchema>;

export function CategoryCombobox({
  form,
}: {
  form: UseFormReturn<FormReturn, any, undefined>;
}) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("Article");
  const c = useTranslations("Categories");

  const categoryLabel = (fieldValue: Category) => {
    const cat = categories.find((category) => category.value === fieldValue);
    return cat ? c(cat.value) : "???";
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {t("category")}
            <Asterisk />
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[300px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? categoryLabel(field.value) : "Select category"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={t("info.search_category")}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{t("info.category_not_found")}</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        value={c(category.value)}
                        key={category.value}
                        onSelect={() => {
                          form.setValue("category", category.value);
                          setOpen(false);
                        }}
                      >
                        {c(category.value)}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            category.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{t("info.category_hints")}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
