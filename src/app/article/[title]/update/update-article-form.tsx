"use client";

import Tiptap from "@/components/editor/tip-tap";
import updateArticleAction from "@/lib/actions/article/updateContent";
import { useState } from "react";

import type { JSONContent } from "@tiptap/react";

export function CreateArticleForm() {
  const [contentJSON, setContentJSON] = useState<JSONContent>([]);
  const updateArticle = updateArticleAction.bind(null, contentJSON);

  return (
    <form action={updateArticle} className="max-w-3xl mx-auto">
      <Tiptap contentJSON={contentJSON} setContentJSON={setContentJSON} />
    </form>
  );
}
