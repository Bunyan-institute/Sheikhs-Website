import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16">
      <header className="mb-12 space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-80 max-w-full" />
      </header>

      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row border border-[#E0D8CE] bg-white rounded-md overflow-hidden">
            <Skeleton className="sm:w-48 h-32 shrink-0" />
            <div className="p-6 flex-grow space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
