import { Skeleton } from '../ui/Skeleton';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full rounded-xl" />
      
      {/* Content Skeleton */}
      <div className="space-y-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Button Skeleton */}
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
}
