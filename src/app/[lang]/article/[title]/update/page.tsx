import Tiptap from "@/components/editor/tip-tap";
import { Language } from "@/lib/constants";

export const runtime = "edge";

export default function Page({ params }: { params: { lang: Language } }) {
  console.log("params", params);
  return (
    <main className="flex-1">
      <section className="py-3 bg-card md:py-14 lg:py-6">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <Tiptap />
          </div>
        </div>
      </section>
    </main>
  );
}
