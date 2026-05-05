"use client";

import { useEffect, useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { getAllReviews, Review } from "@/services/review.service";

export default function AllReviewPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<Review[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { page, handlePageChange } = usePagination();

  useEffect(() => {
  const load = async () => {
    setIsLoading(true);

    const result = await getAllReviews(page, 9);

    if (result.data) {
      setReviews(result.data.data);      // reviews array
      setPaginations(result.data.meta);  // pagination info
    }

    setIsLoading(false);
  };

  load();
}, [page]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Student Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {paginations
              ? `${paginations.total} review${paginations.total !== 1 ? "s" : ""}`
              : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-semibold text-base text-foreground mb-1">No reviews yet</p>
            <p className="text-sm text-muted-foreground">Be the first to review a tutor</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid md:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {paginations && (
              <Pagination paginations={paginations} onPageChange={handlePageChange} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}