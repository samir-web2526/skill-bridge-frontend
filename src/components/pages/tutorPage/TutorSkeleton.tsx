import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function TutorSkeleton() {
  return (
    <Card className="h-[420px] border border-border animate-pulse overflow-hidden rounded-xl flex flex-col">
      <div className="h-40 w-full bg-muted shrink-0" />
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
        <div className="h-16 w-full bg-muted rounded" />
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="h-2 w-12 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-12 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="space-y-1">
            <div className="h-2 w-10 bg-muted rounded" />
            <div className="h-5 w-20 bg-muted rounded" />
          </div>
          <div className="h-9 w-24 bg-muted rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

