// "use client";
// import { useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { MapPin, ArrowRight, Star } from "lucide-react";
// import { getCategoryColor } from "@/lib/category/categoryColors";
// import { TutorProfile } from "@/services/tutors.service";

// function Stars({ rating }: { rating: number }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[1, 2, 3, 4, 5].map((s) => (
//         <Star
//           key={s}
//           size={12}
//           className={
//             s <= Math.floor(rating)
//               ? "fill-amber-400 text-amber-400"
//               : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"
//           }
//         />
//       ))}
//     </div>
//   );
// }


// export default function FeaturedTutors({
//   tutors,
//   user,
// }: {
//   tutors: TutorProfile[];
//   user: { role: string } | null;
// }) {
//   const router = useRouter();

//   return (
//     <>
//       <div className="flex items-end justify-between mb-10">
//         <div>
//           <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
//             Featured
//           </p>
//           <h2 className="text-3xl font-extrabold tracking-tight">
//             Meet our top tutors
//           </h2>
//         </div>
//         <Button
//           variant="ghost"
//           onClick={() => router.push("/tutors")}
//           className="flex items-center gap-2 text-sm font-semibold border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm animate-[bounce_2s_ease-in-out_infinite]"
//         >
//           View all tutors
//           <ArrowRight
//             size={14}
//             className="ml-1.5 group-hover:translate-x-1 transition-transform"
//           />
//         </Button>
//       </div>

//       <div className="grid md:grid-cols-3 gap-5">
//         {tutors.map((t) => {
//           const initials = t.user.name
//             .split(" ")
//             .map((n: string) => n[0])
//             .join("")
//             .toUpperCase()
//             .slice(0, 2);
//           const { shadowHex } = getCategoryColor(t.category?.name ?? "default");
//           return (
//             <Card
//               key={t.id}
//               className="group border border-border transition-all duration-200 hover:-translate-y-1"
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.boxShadow = `0 4px 14px 0 ${shadowHex}`)
//               }
//               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
//             >
//               <CardHeader className="p-5 pb-4">
//                 <div className="flex gap-3 items-start">
//                   <Avatar className="h-12 w-12 rounded-xl shrink-0">
//                     <AvatarFallback className="font-bold text-base rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
//                       {initials}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0">
//                     <div className="font-bold text-base leading-tight">
//                       {t.user.name}
//                     </div>
//                     <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
//                       <MapPin size={11} /> {t.user.email}
//                     </div>
//                     <Badge
//                       variant="outline"
//                       className="mt-1.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
//                     >
//                       {t.category?.name ?? "Tutor"}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="px-5 pb-4">
//                 <Separator className="mb-4" />
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Stars rating={t?.averageRating ?? 0} />
//                     <span className="text-xs text-muted-foreground">
//                       {t?.averageRating} ({t?.totalReview})
//                     </span>
//                   </div>
//                   <div>
//                     <span className="font-extrabold text-base">
//                       ৳{t?.hourlyRate}
//                     </span>
//                     <span className="text-xs text-muted-foreground"> /hr</span>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="px-5 pb-5">
//                 <Button
//                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={!user || user.role !== "STUDENT"}
//                   onClick={() => router.push(`/tutors/${t.id}`)}
//                 >
//                   {user?.role === "STUDENT"
//                     ? "Book a Session"
//                     : "Login as Student to Book"}
//                 </Button>
//               </CardFooter>
//             </Card>
//           );
//         })}
//       </div>
//     </>
//   );
// }


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
import Image from "next/image";

// Backend থেকে _count আসে, এটা normalize করার helper
function normalizeTutor(t: TutorProfile & { _count?: { booking: number; review: number } }) {
  return {
    ...t,
    totalBookings: t.totalBookings ?? (t as any)._count?.booking ?? 0,
    totalReview: t.totalReview ?? (t as any)._count?.review ?? 0,
    averageRating: t.averageRating ?? 0,
    user: {
      ...t.user,
      image: t.user?.image === "https://example.com/avatar.png" ? null : t.user?.image
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
          className="flex items-center gap-2 text-sm font-semibold border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm"
        >
          View all tutors
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {tutors.map((raw) => {
          const t = normalizeTutor(raw as any);
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
              className="group border border-border transition-all duration-200 hover:-translate-y-1"
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 4px 14px 0 ${shadowHex}`)
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <CardHeader className="p-5 pb-4">
                <div className="flex gap-3 items-start">
                  <Avatar className="h-12 w-12 rounded-xl shrink-0">
                    <Image
                      src={t.user.image || `https://i.pravatar.cc/256?u=${t.id}`}
                      alt={t.user.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base leading-tight">
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

              <CardContent className="px-5 pb-5">
                <Separator className="mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Stars rating={t.averageRating} />
                    <span className="text-xs text-muted-foreground">
                      {t.averageRating > 0 ? t.averageRating.toFixed(1) : "New"}{" "}
                      ({t.totalReview})
                    </span>
                  </div>
                  <div>
                    <span className="font-extrabold text-base">
                      ৳{t.hourlyRate}
                    </span>
                    <span className="text-xs text-muted-foreground"> /hr</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                  "{t.bio || "Top-rated tutor ready to help you excel."}"
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}