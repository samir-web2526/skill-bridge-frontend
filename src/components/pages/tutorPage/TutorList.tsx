"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TutorCard, type FormattedTutor } from "./TutorCard";

type Props = {
  tutors: FormattedTutor[];
  isLoading?: boolean;
  onSelect: (tutor: FormattedTutor) => void;
};

function TutorCardSkeleton() {
  return (
    <Card className="border border-border">
      <CardContent className="p-5">
        <div className="flex gap-3 items-start">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mt-3" />
        <Skeleton className="h-3 w-3/4 mt-2" />
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TutorList({ tutors, isLoading = false, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <TutorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tutors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <p className="font-semibold text-base text-foreground mb-1">
          No tutors found
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} onSelect={onSelect} />
      ))}
    </div>
  );
}
