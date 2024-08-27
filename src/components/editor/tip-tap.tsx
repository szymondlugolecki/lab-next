"use client";

import { EditorEvents, EditorProvider } from "@tiptap/react";
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
// import { CustomEditorMenu } from "./custom-editor-menu";
// import type { JSONContent } from "@tiptap/react";
import editArticleContent from "@/lib/actions/article/edit/content";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

export default function Tiptap({
  id,
  fetchedContent,
}: {
  id: string;
  fetchedContent?: string;
}) {
  const saveContent = async (editor: EditorEvents["update"]["editor"]) => {
    const articleJSON = editor.getJSON();
    const promise = editArticleContent({
      content: JSON.stringify(articleJSON),
      id,
    });

    toast.promise(promise, {
      loading: "",
      success: () => {
        return `Saved`;
      },
      error: "Failed to save",
      duration: 1500,
    });

    const result = await promise;

    const error = result?.data?.error || result?.serverError;
    if (error) {
      toast.error(error);
    }
  };

  const debouncedOnChange = useDebounceCallback(saveContent, 3500);

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

  return (
    <div className="[&>*:second-child]:w-auto grid relative">
      <EditorProvider
        slotBefore={<CustomMenuBar />}
        extensions={extensions}
        content={fetchedContent}
        onUpdate={({ editor }) => {
          debouncedOnChange(editor);
        }}
        editorProps={{
          attributes: {
            class:
              "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-5 focus:outline-none",
          },
        }}
      >
        <CustomBubbleMenu />
      </EditorProvider>
    </div>
  );
}
