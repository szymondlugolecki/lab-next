"use client";

import Tiptap from "@/components/editor/tip-tap";
import createArticleWithoutContent from "@/lib/actions/article/create";
import { useState } from "react";

import type { JSONContent } from "@tiptap/react";

export function CreateArticleForm() {
  const [contentJSON, setContentJSON] = useState<JSONContent>({});
  const createArticle = createArticleWithoutContent.bind(null, contentJSON);

  return (
    <form action={createArticle} className="max-w-3xl mx-auto">
      <div className="pb-3 px-5 flex prose dark:prose-invert">
        <input
          placeholder="Title"
          name="title"
          className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
        />
      </div>
      <Tiptap contentJSON={contentJSON} setContentJSON={setContentJSON} />
    </form>
  );
}
