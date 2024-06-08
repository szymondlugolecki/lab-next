"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  PilcrowIcon,
  StrikethroughIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";

import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { LuHeading3 } from "react-icons/lu";
import { LuHeading4 } from "react-icons/lu";
import { LuHeading5 } from "react-icons/lu";
import { LuHeading6 } from "react-icons/lu";

import { FaListUl } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";

import { FaQuoteRight } from "react-icons/fa6";

export function CustomMenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-3 bg-popover rounded-md z-10 self-start">
      <div className="gap-x-1 gap-y-1 px-3 py-3 select-none grid grid-cols-[repeat(auto-fill,2rem)]">
        {/* Pillcrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            editor.isActive("paragraph") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <PilcrowIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 1 }) &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <LuHeading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 2 }) &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <LuHeading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 3 }) &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <LuHeading3 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 4 }) &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <LuHeading4 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 5 }) &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <LuHeading5 className="h-4 w-4" />
        </Button>

        {/* Heading 6 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 6 }) &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <LuHeading6 className="h-4 w-4" />
        </Button>

        {/* Bullet List */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            editor.isActive("bulletList") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <FaListUl className="h-4 w-4" />
        </Button>

        {/* Ordered List */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            editor.isActive("orderedList") &&
              "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <FaListOl className="h-4 w-4" />
        </Button>

        {/* Code */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            editor.isActive("codeBlock") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <CodeIcon className="h-4 w-4" />
        </Button>

        {/* Blockquote */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            editor.isActive("blockquote") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <FaQuoteRight className="h-4 w-4" />
        </Button>

        {/* Row/Col 2 */}

        {/* Bold */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            editor.isActive("bold") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <FontBoldIcon className="h-4 w-4" />
        </Button>

        {/* Italic */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            editor.isActive("italic") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <FontItalicIcon className="h-4 w-4" />
        </Button>

        {/* Strikethrough */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            editor.isActive("strike") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <StrikethroughIcon className="h-4 w-4" />
        </Button>

        {/* Undo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={cn(
            editor.isActive("strike") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
        </Button>

        {/* Redo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={cn(
            editor.isActive("strike") && "bg-accent text-accent-foreground",
            "h-8 w-8"
          )}
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
