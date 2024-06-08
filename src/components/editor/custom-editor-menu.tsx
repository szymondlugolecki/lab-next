import { useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";

export function CustomEditorMenu() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-popover rounded-md z-10 p-3 flex justify-end">
      {/* sticky bottom-3 */}
      <Button type="submit">Create Article</Button>
    </div>
  );
}
