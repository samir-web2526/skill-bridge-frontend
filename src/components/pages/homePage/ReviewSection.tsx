/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getAllReviews } from "@/lib/reviews/reviewsActions";
import { ReviewCard } from "../ReviewPage/ReviewCard";
import { Button } from "@/components/ui/button";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const result = await getAllReviews(1, 3);
      if (result?.data) setReviews(result.data);
    }
    load();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/reviews")}
          className="flex items-center gap-2 text-sm font-semibold border border-emerald-300 text-emerald-700 hover:bg-emerald-50 shadow-md shadow-emerald-100 animate-[bounce_2s_ease-in-out_infinite]"
        >
          View all reviews
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
