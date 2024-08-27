import { JSONContent, useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import editArticleContent from "@/lib/actions/article/edit/content";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/constants";
import { ArticleEditContentSchema } from "@/lib/schemas/article";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { article$ } from "@/lib/schemas";
import { useTranslations } from "next-intl";
import { Spinner } from "../spinner";
import { toast } from "sonner";

export function CustomEditorMenu({
  contentJSON,
  pending,
  id,
}: {
  contentJSON: JSONContent;
  pending: boolean;
  id: string;
}) {
  const t = useTranslations();
  const { lang } = useParams<{ lang: Locale; title: string }>();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<ArticleEditContentSchema>({
    resolver: zodResolver(article$.edit().content),
    mode: "onChange",
  });

  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const onSubmit = handleSubmit(async (data) => {
    const result = await editArticleContent({
      content: JSON.stringify(contentJSON),
      id,
      language: lang,
    });
    const error = result?.data?.error || result?.serverError;
    console.log("result", result);
    if (error) {
      toast.error(error);
    } else {
      toast("Success");
    }
  });

  // Imperfect solution to check if the content has changed
  // Will still return true if the content is the same, but the user has undone a change
  const hasChanged = editor.can().chain().focus().undo().run();

  return (
    <form
      onSubmit={onSubmit}
      className="bg-popover rounded-md z-10 p-3 flex justify-end"
    >
      <Button type="submit" disabled={pending || isSubmitting || !hasChanged}>
        {isSubmitting ? <Spinner /> : t("Article.content.edit_article_button")}
      </Button>
    </form>
  );
}
