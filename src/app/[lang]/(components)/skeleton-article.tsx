import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonArticle() {
  return (
    <div className="flex border bg-card shadow rounded-xl">
      {/* Image */}
      <Skeleton className="h-[225px] w-[400px] rounded-t-md" />
      <div className="flex flex-col gap-y-3 p-6 flex-grow">
        <div className="flex flex-col gap-y-2">
          {/* Title */}
          <Skeleton className="h-7 w-[300px]" />
          {/* Date */}
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex flex-col gap-y-2">
          {/* Description */}
          <Skeleton className="h-10 w-full" />
          {/* Read more */}
          <Skeleton className="h-6 w-[100px]" />
        </div>
      </div>
    </div>
  );
}

{
  /* <Card className="flex" key={index}>
<CardContent className="p-6 flex flex-col gap-y-3">
  <div className="flex flex-col gap-y-1">

  </div>
  <div className="flex flex-col gap-y-2">
    <p className="text-gray-500 text-sm">
      Dive into the latest advancements in genomic research and
      how they are transforming the field of medicine.
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
</Card> */
}
