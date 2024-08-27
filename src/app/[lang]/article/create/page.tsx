import { CreateArticleForm } from "./create-article-form";

export default function Page() {
  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <CreateArticleForm />
        </div>
      </section>
    </main>
  );
}
