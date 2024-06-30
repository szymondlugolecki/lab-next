"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CustomMenuBar } from "./custom-menu-bar";

// Extensions
import BubbleMenu from "@tiptap/extension-bubble-menu";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Emoji, { gitHubEmojis } from "@tiptap-pro/extension-emoji";

// Marks
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";

// Nodes
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";

import { mentionSuggestionOptions } from "./mentionSuggestionOptions";
import { CustomBubbleMenu } from "./custom-bubble-menu";
import { CustomEditorMenu } from "./custom-editor-menu";
import type { JSONContent } from "@tiptap/react";

export default function Tiptap({
  id,
  fetchedContent,
}: {
  id: string;
  fetchedContent?: string;
}) {
  const [contentJSON, setContentJSON] = useState<JSONContent>({});
  const { pending } = useFormStatus();
  console.log("pending", pending);

  const extensions = [
    // Extensions
    StarterKit,
    BubbleMenu,
    CharacterCount,
    Typography,
    Emoji.configure({
      emojis: gitHubEmojis,
      enableEmoticons: true,
    }),
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
      },
      suggestion: mentionSuggestionOptions,
    }),
    // FloatingMenu

    // Nodes
    TextStyle,
    Color,
    Table,
    TableRow,
    TableCell,
    TableHeader,
    TaskItem,
    TaskList,
    Youtube,
    Image,

    // Marks
    Highlight,
    Link,
    Subscript,
    Superscript,
    Underline,
  ];

  const content =
    fetchedContent ||
    `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

  return (
    // sm:flex sm:flex-row-reverse
    <div className="[&>*:second-child]:w-auto grid relative">
      <EditorProvider
        slotBefore={<CustomMenuBar />}
        extensions={extensions}
        content={content}
        onCreate={({ editor }) => setContentJSON(editor.getJSON())}
        onUpdate={({ editor }) => setContentJSON(editor.getJSON())}
        editorProps={{
          attributes: {
            class:
              "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-5 focus:outline-none",
          },
        }}
      >
        <CustomBubbleMenu />
        <CustomEditorMenu id={id} contentJSON={contentJSON} pending={pending} />
      </EditorProvider>
    </div>
  );
}
