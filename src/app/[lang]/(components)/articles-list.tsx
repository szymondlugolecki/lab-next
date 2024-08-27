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
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFormatter } from "next-intl";
import { getFormatter, getTranslations } from "next-intl/server";

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

export async function ArticlesList() {
  const articles = await fetchArticles();
  const t = await getTranslations("Index");
  const format = await getFormatter();

  return (
    <>
      {articles.map((_, index) => (
        <Card className="flex" key={index}>
          <CardHeader className="p-0">
            <div className="w-[400px] h-[225px]">
              <Image
                src="/placeholder.svg"
                alt="Article thumbnail"
                width={400}
                height={225}
                className="rounded-t-md"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-1">
              <h3 className="text-xl font-bold">
                Unlocking the Secrets of the Human Genome
              </h3>
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
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-gray-500 text-sm">
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
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
