import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 md:py-20">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-12 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
