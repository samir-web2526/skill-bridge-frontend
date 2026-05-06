"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { TutorProfile } from "@/services/tutors.service";

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
              : "fill-zinc-200 text-zinc-200"
          }
        />
      ))}
    </div>
  );
}


export default function FeaturedTutors({
  tutors,
  user,
}: {
  tutors: TutorProfile[];
  user: { role: string } | null;
}) {
  const router = useRouter();

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
          variant="ghost"
          onClick={() => router.push("/tutors")}
          className="flex items-center gap-2 text-sm font-semibold border border-emerald-300 text-emerald-700 hover:bg-emerald-50 shadow-md shadow-emerald-100 animate-[bounce_2s_ease-in-out_infinite]"
        >
          View all tutors
          <ArrowRight
            size={14}
            className="ml-1.5 group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {tutors.map((t) => {
          const initials = t.user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          const { shadowHex } = getCategoryColor(t.category?.name ?? "default");
          return (
            <Card
              key={t.id}
              className="group border border-zinc-100 transition-all duration-200 hover:-translate-y-1"
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 4px 14px 0 ${shadowHex}`)
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <CardHeader className="p-5 pb-4">
                <div className="flex gap-3 items-start">
                  <Avatar className="h-12 w-12 rounded-xl shrink-0">
                    <AvatarFallback className="font-bold text-base rounded-xl bg-emerald-100 text-emerald-700">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base leading-tight">
                      {t.user.name}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={11} /> {t.user.email}
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {t.category?.name ?? "Tutor"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars rating={t?.averageRating ?? 0} />
                    <span className="text-xs text-zinc-400">
                      {t?.averageRating} ({t?.totalReview})
                    </span>
                  </div>
                  <div>
                    <span className="font-extrabold text-base">
                      ৳{t?.hourlyRate}
                    </span>
                    <span className="text-xs text-zinc-400"> /hr</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-5 pb-5">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!user || user.role !== "STUDENT"}
                  onClick={() => router.push(`/tutors/${t.id}`)}
                >
                  {user?.role === "STUDENT"
                    ? "Book a Session"
                    : "Login as Student to Book"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
