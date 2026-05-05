"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ReviewCard } from "../ReviewPage/ReviewCard";
import { Button } from "@/components/ui/button";
import { getAllReviews, Review } from "@/services/review.service";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const result = await getAllReviews(1, 3);

      if (result.data) {
        setReviews(result.data.data);
      }

      setIsLoading(false);
    };

    load();
  }, []);

  if (!isLoading && reviews.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-3 gap-5">
        {Array.isArray(reviews) &&
          reviews.map((review) => (
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