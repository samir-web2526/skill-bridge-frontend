"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { getCategoryColor } from "@/lib/category/categoryColors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReviewCard({ review }: { review: any }) {
  const color = getCategoryColor(review.tutor?.category?.name ?? "");
  const shadow = color.shadowHex;

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

  return (
    <Card
      className="border border-border transition-all duration-200 flex flex-col hover:-translate-y-0.5"
      style={{ boxShadow: `0 1px 3px 0 ${shadow}99` }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 8px 24px -4px ${shadow}, 0 2px 8px -2px ${shadow}cc`;
        (e.currentTarget as HTMLElement).style.borderColor = shadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 1px 3px 0 ${shadow}99`;
        (e.currentTarget as HTMLElement).style.borderColor = "";
      }}
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
            <p className={`text-xs font-medium ${color.text}`}>
              {review.tutor?.category?.name ?? ""}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
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
}
