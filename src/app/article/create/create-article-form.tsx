"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import createArticle from "@/lib/actions/article/create";
import { Input } from "@/components/ui/input";

const articleCreateSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Invalid title",
      required_error: "Title is required",
    })
    .min(3),
});

export function CreateArticleForm() {
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof articleCreateSchema>>({
    resolver: zodResolver(articleCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await createArticle(data);
    if (response?.error) {
      const { error } = response;
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof error === "string" ? error : error.title,
      });
    } else {
      toast({
        title: "Success",
        description: "Article created!",
      });
      form.reset();
    }
  });

  // 2. Define a submit handler.
  //   function onSubmit(values: z.infer<typeof formSchema>) {
  //     const response = await createJoke(data);
  //     if (response?.error) {
  //       toast.error(response.error);
  //     } else {
  //       toast.success("Joke added!");
  //       form.reset();
  //     }
  //   }

  <input
    placeholder="Title"
    name="title"
    className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
  />;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="select-none">Title</FormLabel>
              <FormControl>
                <input
                  placeholder="Variety of compounds in Orange Juice"
                  className="flex h-14 w-full rounded-none text-2xl font-semibold border-0 focus:border-b border-input bg-transparent ring-0 outline-none py-1 shadow-sm transition-all placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A title should be clear and concise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Article</Button>
      </form>
    </Form>
  );
}
