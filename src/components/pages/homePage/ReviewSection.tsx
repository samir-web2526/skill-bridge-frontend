/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { getAllReviews } from "@/lib/reviews/reviewsActions";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const result = await getAllReviews(1, 3);
      console.log(result)
      if (result?.data) setReviews(result.data);
    }
    fetch();
  }, []);

  if (reviews.length === 0) return null;

  const avatarColors = [
    { bg: "bg-emerald-50", text: "text-emerald-700" },
    { bg: "bg-purple-50", text: "text-purple-700" },
    { bg: "bg-amber-50", text: "text-amber-800" },
    { bg: "bg-blue-50", text: "text-blue-700" },
    { bg: "bg-rose-50", text: "text-rose-700" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {reviews.map((review) => {
        const tutorInitials =
          review.tutor?.user?.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "T";
        const studentInitials =
          review.user?.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "S";

        const color =
          avatarColors[review.id?.charCodeAt(0) % avatarColors.length] ??
          avatarColors[0];

        return (
          <Card
            key={review.id}
            className="border border-zinc-100 hover:shadow-md transition-shadow flex flex-col"
          >
            <CardContent className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback
                    className={`font-medium text-sm ${color.bg} ${color.text}`}
                  >
                    {tutorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {review.tutor?.user?.name ?? "Tutor"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.tutor?.category?.name ?? ""}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_: unknown, i: number) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-zinc-200 text-zinc-200"
                    }
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {review.comment ?? "Great tutor!"}
              </p>

              <Separator />

              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[11px] font-medium bg-zinc-100 text-zinc-600">
                    {studentInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {review.user?.name ?? "Student"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Verified Student
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}