import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader } from './ui/card';

export function IPOCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-8" />
            </div>
            <div className="text-center">
              <Skeleton className="h-4 w-8 mb-1" />
              <Skeleton className="h-5 w-8" />
            </div>
            <div className="text-center">
              <Skeleton className="h-4 w-10 mb-1" />
              <Skeleton className="h-5 w-8" />
            </div>
          </div>
        </div>

        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function IPOGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <IPOCardSkeleton key={index} />
      ))}
    </div>
  );
}