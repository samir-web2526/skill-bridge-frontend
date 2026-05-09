"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TutorCard, type FormattedTutor } from "./TutorCard";
import { TutorSkeleton } from "./TutorSkeleton";

type Props = {
  tutors: FormattedTutor[];
  isLoading?: boolean;
  onSelect: (tutor: FormattedTutor) => void;
};

export function TutorList({ tutors, isLoading = false, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <TutorSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tutors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl border border-border border-dashed">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
           <span className="text-3xl">🔍</span>
        </div>
        <p className="font-bold text-lg text-foreground mb-1">
          No tutors found
        </p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          We couldn't find any tutors matching your search. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} onSelect={onSelect} />
      ))}
    </div>
  );
}

