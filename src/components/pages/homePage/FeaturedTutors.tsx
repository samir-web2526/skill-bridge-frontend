"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { TutorProfile } from "@/services/tutors.service";
import Image from "next/image";
import Link from "next/link";

function normalizeTutor(t: TutorProfile & { _count?: { booking: number; review: number } }) {
  return {
    ...t,
    totalBookings: t.totalBookings ?? (t as any)._count?.booking ?? 0,
    totalReview: t.totalReview ?? (t as any)._count?.review ?? 0,
    averageRating: t.averageRating ?? 0,
    user: {
      ...t.user,
      image: t.user?.image && t.user.image !== "https://example.com/avatar.png" ? t.user.image : null
    },
    availability: t.availability ?? (t as any).availablity ?? (t as any).isAvailable ?? (t as any).isAdvailable ?? false,
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"
          }
        />
      ))}
    </div>
  );
}

export default function FeaturedTutors({
  tutors,
  isLoading = false,
}: {
  tutors: TutorProfile[];
  user: { role: string } | null;
  isLoading?: boolean;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-[420px] animate-pulse border-border">
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-20 bg-muted rounded w-full" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
            Featured
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Meet our top tutors
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="flex items-center gap-2 text-sm font-semibold border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm transition-all"
        >
          <Link href="/tutors">
            View all tutors
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tutors.map((raw) => {
          const t = normalizeTutor(raw as any);
          const { shadowHex } = getCategoryColor(t.category?.name ?? "default");

          return (
            <Link key={t.id} href={`/tutors/${t.id}`} className="block group">
              <Card
                className="h-full border border-border transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg flex flex-col"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 12px 24px -10px ${shadowHex}`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <CardHeader className="p-5 pb-4">
                  <div className="flex gap-3 items-start">
                    <Avatar className="h-12 w-12 rounded-xl shrink-0 border border-border overflow-hidden">
                      <Image
                        src={t.user.image || `https://i.pravatar.cc/256?u=${t.id}`}
                        alt={t.user.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base leading-tight group-hover:text-emerald-600 transition-colors truncate">
                        {t.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin size={11} />
                        {t.experience} yrs experience
                      </div>
                      <Badge
                        variant="outline"
                        className="mt-1.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                      >
                        {t.category?.name ?? "Tutor"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5 flex-1 flex flex-col">
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Stars rating={t.averageRating} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {t.averageRating > 0 ? t.averageRating.toFixed(1) : "New"}{" "}
                        ({t.totalReview})
                      </span>
                    </div>
                    <div>
                      <span className="font-extrabold text-base text-foreground">
                        ৳{t.hourlyRate}
                      </span>
                      <span className="text-xs text-muted-foreground"> /hr</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 italic leading-relaxed mb-6">
                    "{t.bio || `Specialized in ${t.category?.name ?? "education"} with ${t.experience} years of practical teaching experience.`}"
                  </p>

                  <div className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full text-xs font-bold border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all"
                    >
                      View Details
                      <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
