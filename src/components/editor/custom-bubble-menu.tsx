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

import { BubbleMenu } from "@tiptap/react";

export function CustomBubbleMenu() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex gap-x-1"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
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
        className={cn(
          editor.isActive("strike") && "bg-accent text-accent-foreground",
          "h-7 w-7"
        )}
      >
        <StrikethroughIcon />
      </Button>
    </BubbleMenu>
  );
}
