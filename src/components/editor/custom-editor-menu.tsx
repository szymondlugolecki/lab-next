import { JSONContent, useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import editContent from "@/lib/actions/article/editContent";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/constants";
import { ArticleEditContentSchema } from "@/lib/schemas/article";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { article$ } from "@/lib/schemas";
import { toast } from "../ui/use-toast";
import { errorToToast } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Spinner } from "../spinner";

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
    console.log("on submit");
    const response = await editContent({
      content: JSON.stringify(contentJSON),
      locale: lang,
      id,
    });
    console.log("response", response);
    if (response?.error) {
      const errorMessages = errorToToast(response.error);
      errorMessages.forEach((error) =>
        toast({ title: "Error", description: error })
      );
    } else {
      toast({
        title: "Success",
        description: "Article edited!",
      });
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
        {isSubmitting ? <Spinner /> : t("Article.content.edit_article")}
      </Button>
    </form>
  );
}
