import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
// import { Input } from '@/components/ui/input';
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";
// import Search from './ui/search';
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const runtime = "edge";

const filters = {
  conditions: [
    "Androgenic Alopecia",
    "Diabetes",
    "Heart Disease",
    "Alzheimer's Disease",
  ],
  outcomes: ["Blood Glucose", "Blood Pressure", "Testosterone", "Serotonin"],
  categories: ["Sleep", "Longevity", "Gut Health", "Fat Loss"],
  interventions: ["Fasting", "Magnesium", "Vitamin D", "DHEA"],
} as const;

type FilterKeys = keyof typeof filters;

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <main className="flex-1">
      <section className="py-12 bg-card md:py-20 lg:py-24">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              Explore the Latest Medical Breakthroughs
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Explore my collection of research notes and .
            </p>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute h-6 w-6 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="w-full px-12 py-3 rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.keys(filters).map((filter, index1) => (
                <div key={index1}>
                  <h3 className="text-lg font-semibold mb-2">
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </h3>
                  <div className="space-y-2">
                    {filters[filter as FilterKeys].map((condition, index2) => (
                      <div className="flex items-center gap-2" key={index2}>
                        <Link
                          href={`/${filter}/${condition
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                        >
                          {condition}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-12 md:py-20 lg:py-24">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="flex items-center gap-x-2 pb-3">
            <p className="font-semibold">New articles</p>
            <span className="text-muted-foreground text-sm">•</span>
            <Link
              href="/articles"
              className="flex items-center gap-x-1 leading-4 text-sm text-muted-foreground hover:underline"
            >
              Browse all <ArrowRightIcon className="w-3 h-3 stroke-[3px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Image
                  src="/placeholder.svg"
                  alt="Article thumbnail"
                  width={400}
                  height={225}
                  className="rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>May 15, 2023</span>
                  <span>·</span>
                  <span>5 min read</span>
                </div>
                <h3 className="text-xl font-bold">
                  Unlocking the Secrets of the Human Genome
                </h3>
                <p className="text-gray-500">
                  Dive into the latest advancements in genomic research and how
                  they are transforming the field of medicine.
                </p>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Read more
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Image
                  src="/placeholder.svg"
                  alt="Article thumbnail"
                  width={400}
                  height={225}
                  className="rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>April 28, 2023</span>
                  <span>·</span>
                  <span>8 min read</span>
                </div>
                <h3 className="text-xl font-bold">
                  Revolutionizing Cancer Treatment with Immunotherapy
                </h3>
                <p className="text-gray-500">
                  Explore the groundbreaking advancements in immunotherapy and
                  how they are changing the landscape of cancer treatment.
                </p>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Read more
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Image
                  src="/placeholder.svg"
                  alt="Article thumbnail"
                  width={400}
                  height={225}
                  className="rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>March 12, 2023</span>
                  <span>·</span>
                  <span>6 min read</span>
                </div>
                <h3 className="text-xl font-bold">
                  The Future of Personalized Medicine
                </h3>
                <p className="text-gray-500">
                  Discover how personalized medicine is revolutionizing
                  healthcare and improving patient outcomes.
                </p>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Read more
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className=" pb-3">
            <p className="font-semibold">Recently edited</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Image
                  src="/placeholder.svg"
                  alt="Article thumbnail"
                  width={400}
                  height={225}
                  className="rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Updated May 10, 2023</span>
                </div>
                <h3 className="text-xl font-bold">
                  Exploring the Gut-Brain Connection
                </h3>
                <p className="text-gray-400">
                  Dive into the latest research on the intricate relationship
                  between the gut and the brain, and how it impacts our overall
                  health.
                </p>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Read more
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Image
                  src="/placeholder.svg"
                  alt="Article thumbnail"
                  width={400}
                  height={225}
                  className="rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Updated April 22, 2023</span>
                </div>
                <h3 className="text-xl font-bold">
                  The Rise of Telemedicine: Transforming Healthcare
                </h3>
                <p className="text-gray-400">
                  Explore how telemedicine is revolutionizing the way we access
                  and receive healthcare, and the benefits it provides to
                  patients and healthcare providers.
                </p>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Read more
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Image
                  src="/placeholder.svg"
                  alt="Article thumbnail"
                  width={400}
                  height={225}
                  className="rounded-t-md"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Updated March 28, 2023</span>
                </div>
                <h3 className="text-xl font-bold">
                  The Future of Regenerative Medicine
                </h3>
                <p className="text-gray-400">
                  Discover the groundbreaking advancements in regenerative
                  medicine and how they are transforming the treatment of
                  various medical conditions.
                </p>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Read more
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>

    // <main className="flex flex-col items-center min-h-screen p-6">
    //   <h1 className="max-w-xl text-2xl font-semibold sm:text-3xl">
    //     What subject are you interested in?
    //   </h1>
    //   <h2 className="max-w-xl text-base font-semibold sm:text-lg">
    //     {/* Nutrition. Longevity. Supplements. Hormones. */}
    //     1. 2. 3. 4
    //   </h2>
    //   <Search placeholder="Search..." />

    //   <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
    //     {/* <Table query={query} currentPage={currentPage} /> */}
    //   </Suspense>
    // </main>
  );
}

//  <form
//     action={async () => {
//       "use server";
//       await signIn("google");
//     }}
//   >
//     <Button type="submit">Sign in with Google</Button>
//   </form>
