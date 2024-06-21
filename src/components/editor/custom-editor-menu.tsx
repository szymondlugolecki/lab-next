import { JSONContent, useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import updateContentAction from "@/lib/actions/article/updateContent";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/constants";

export function CustomEditorMenu({
  contentJSON,
  pending,
  articleId,
}: {
  contentJSON: JSONContent;
  pending: boolean;
  articleId: string;
}) {
  const { title, lang } = useParams<{ lang: Locale; title: string }>();
  const updateContent = updateContentAction.bind(null, {
    content: JSON.stringify(contentJSON),
    locale: lang,
    id: articleId,
  });
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <form
      action={updateContent}
      className="bg-popover rounded-md z-10 p-3 flex justify-end"
    >
      {/* sticky bottom-3 */}
      <Button type="submit" disabled={pending}>
        Update Article
      </Button>
    </form>
  );
}
