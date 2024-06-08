import { useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  CodeIcon,
  EraserIcon,
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  PilcrowIcon,
  StrikethroughIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";

export function CustomMenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-1 py-2 sticky top-0 bg-card z-10 px-5">
      <div className="flex gap-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            editor.isActive("paragraph") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <PilcrowIcon />
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
            "h-7 w-7"
          )}
        >
          h1
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
            "h-7 w-7"
          )}
        >
          h2
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
            "h-7 w-7"
          )}
        >
          h3
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
            "h-7 w-7"
          )}
        >
          h4
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
            "h-7 w-7"
          )}
        >
          h5
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={cn(
            editor.isActive("heading", { level: 6 }) &&
              "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          h6
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            editor.isActive("bulletList") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <ListBulletIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            editor.isActive("orderedList") &&
              "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          1.
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            editor.isActive("codeBlock") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <CodeIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            editor.isActive("blockquote") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          {`❞`}
        </Button>
      </div>

      <div className="flex gap-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            editor.isActive("bold") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <FontBoldIcon />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            editor.isActive("italic") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <FontItalicIcon />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            editor.isActive("strike") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <StrikethroughIcon />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={cn(
            editor.isActive("strike") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <ArrowUturnLeftIcon className="w-[15px] h-[15px]" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={cn(
            editor.isActive("strike") && "bg-accent text-accent-foreground",
            "h-7 w-7"
          )}
        >
          <ArrowUturnRightIcon className="w-[15px] h-[15px]" />
        </Button>
      </div>
    </div>
  );
}
