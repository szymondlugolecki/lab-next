"use client";

import Tiptap from "@/components/editor/tip-tap";
// import updateArticle from "@/lib/actions/article/update";
import { useState } from "react";

import type { JSONContent } from "@tiptap/react";

export const runtime = "edge";

export default function Page() {
  const [contentJSON, setContentJSON] = useState<JSONContent>({});
  // console.log("contentJSON", contentJSON);
  // const createArticle = createArticleWithoutContent.bind(
  //   null,
  //   JSON.stringify(contentJSON)
  // );

  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="pb-3 px-5 flex prose dark:prose-invert">
              <input
                placeholder="Title"
                name="title"
                className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
              />
            </div>
            <Tiptap contentJSON={contentJSON} setContentJSON={setContentJSON} />
          </div>
        </div>
      </section>
    </main>
  );
}
