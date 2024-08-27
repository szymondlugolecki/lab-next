import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
// import Search from './ui/search';
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFormatter } from "next-intl";
import { SkeletonArticle } from "./(components)/skeleton-article";
import { getFormatter, getTranslations } from "next-intl/server";
import { ArticlesList } from "./(components)/articles-list";

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

const sleep = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const fetchArticles = async () => {
  await sleep(3);

  const article = {
    title: "Unlocking the Secrets of the Human Genome",
    date: new Date(),
    description:
      "Dive into the latest advancements in genomic research and how they are transforming the field of medicine.",
    minutesToRead: 5,
  };

  return [article, article, article];
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const t = await getTranslations("Index");
  const format = await getFormatter();
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const articles = await fetchArticles();

  console.log("t", t("h1"));

  return (
    <main className="flex-1">
      <section className="py-12 bg-card md:py-20 lg:py-24">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              {t("h1")}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">{t("p")}</p>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute h-6 w-6 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("input")}
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
            <p className="font-semibold">{t("new_articles")}</p>
            {/* <span className="text-muted-foreground text-sm">•</span>
            <Link
              href="/articles"
              className="flex items-center gap-x-1 leading-4 text-sm text-muted-foreground hover:underline"
            >
              {t("browse_all")}{" "}
              <ArrowRightIcon className="w-3 h-3 stroke-[3px]" />
            </Link> */}
          </div>
          <div className="grid grid-cols-1 gap-y-8 px-1">
            <Suspense
              fallback={Array.from({ length: 3 }).map((_, index) => (
                <SkeletonArticle key={index} />
              ))}
            >
              <ArticlesList />
            </Suspense>
          </div>
          {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <span>
                    {format.dateTime(new Date(), {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{t("minute_read", { minutes: 5 })}</span>
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
                  {t("read_more")}
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
                  <span>
                    {format.dateTime(new Date(), {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{t("minute_read", { minutes: 8 })}</span>
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
                  {t("read_more")}
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
                  <span>
                    {format.dateTime(new Date(), {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{t("minute_read", { minutes: 6 })}</span>
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
                  {t("read_more")}
                </Link>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </section>

      {/* <section className="py-12 md:py-20 lg:py-24">
        <div className="container px-6 mx-auto md:px-8 lg:px-12">
          <div className=" pb-3">
            <p className="font-semibold">{t("recently_edited")}</p>
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
                  <span>{t("updated", { updateDate: new Date() })}</span>
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
                  {t("read_more")}
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
                  <span>{t("updated", { updateDate: new Date() })}</span>
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
                  {t("read_more")}
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
                  <span>{t("updated", { updateDate: new Date() })}</span>
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
                  {t("read_more")}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
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
