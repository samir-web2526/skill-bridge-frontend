/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getAllReviews } from "@/lib/reviews/reviewsActions";
import { ReviewCard } from "../ReviewPage/ReviewCard";


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
        <button
          onClick={() => router.push("/reviews")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200"
        >
          View all reviews
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}