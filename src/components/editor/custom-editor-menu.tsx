import { JSONContent, useCurrentEditor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import updateContent from "@/lib/actions/article/updateContent";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/constants";
import { ArticleUpdateContentSchema } from "@/lib/schemas/article";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { article$ } from "@/lib/schemas";
import { toast } from "../ui/use-toast";
import { errorToToast } from "@/lib/utils";

export function CustomEditorMenu({
  contentJSON,
  pending,
  id,
}: {
  contentJSON: JSONContent;
  pending: boolean;
  id: string;
}) {
  const { lang } = useParams<{ lang: Locale; title: string }>();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<ArticleUpdateContentSchema>({
    resolver: zodResolver(article$.update().content),
    mode: "onChange",
  });

  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const onSubmit = handleSubmit(async (data) => {
    console.log("on submit");
    const response = await updateContent({
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
        description: "Article updated!",
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-popover rounded-md z-10 p-3 flex justify-end"
    >
      <Button type="submit" disabled={pending || isSubmitting}>
        {isSubmitting ? "Updating Article..." : "Update Article"}
      </Button>
    </form>
  );
}
