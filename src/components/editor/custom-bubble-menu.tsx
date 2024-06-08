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
      className="flex gap-x-1 p-1 rounded-md bg-popover"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          editor.isActive("bold") && "bg-accent text-accent-foreground",
          "h-9 w-9"
        )}
      >
        <FontBoldIcon className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          editor.isActive("italic") && "bg-accent text-accent-foreground",
          "h-9 w-9"
        )}
      >
        <FontItalicIcon className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          editor.isActive("strike") && "bg-accent text-accent-foreground",
          "h-9 w-9"
        )}
      >
        <StrikethroughIcon className="w-5 h-5" />
      </Button>
    </BubbleMenu>
  );
}
