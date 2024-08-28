"use client";

import * as React from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag, TAGS_MAP } from "@/lib/constants";
import { UseFormReturn } from "react-hook-form";
import { ArticleEditSettingsSchema } from "@/lib/schemas/article";

export function TagsCombobox({
  form,
}: {
  form: UseFormReturn<ArticleEditSettingsSchema, any, undefined>;
}) {
  const [open, setOpen] = React.useState(false);
  const alreadySelectedTags = form.getValues("tags") || [];

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none">
        Tags
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            <>+ Add a tag</>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Add a tag..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {/* Only showing tags that aren't already selected */}
                {TAGS_MAP.filter(
                  (tag) => !alreadySelectedTags.includes(tag.value)
                ).map((tag) => (
                  <CommandItem
                    key={tag.value}
                    value={tag.value}
                    onSelect={(value) => {
                      const currentTags = form.getValues("tags");
                      form.setValue(
                        "tags",
                        currentTags
                          ? [...currentTags, value as Tag]
                          : [value as Tag]
                      );

                      setOpen(false);
                    }}
                  >
                    {tag.key}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
