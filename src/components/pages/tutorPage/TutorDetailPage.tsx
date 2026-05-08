// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Star, Users, Clock, BookOpen, ArrowLeft } from "lucide-react";
// import { FormattedTutor } from "./TutorCard";
// import { BookingModal } from "./BookingModal";
// import { getCategoryColor } from "@/lib/category/categoryColors";
// import Image from "next/image";

// function getInitials(name = "") {
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// type Props = {
//   tutor: FormattedTutor;
//   user: { role: string } | null;
// };

// export default function TutorDetailPage({ tutor, user }: Props) {
//   const router = useRouter();
//   const isStudent = user?.role === "STUDENT";
//   const color = getCategoryColor(tutor.category?.name ?? "default");
//   const initials = getInitials(tutor.user.name);

//   const [showBooking, setShowBooking] = useState(false);

//   const stats = [
//     {
//       icon: <Star className="w-4 h-4" />,
//       label: "Rating",
//       value: tutor.averageRating > 0 ? tutor.averageRating.toFixed(1) : "New",
//     },
//     {
//       icon: <BookOpen className="w-4 h-4" />,
//       label: "Reviews",
//       value: tutor.totalReview,
//     },
//     {
//       icon: <Users className="w-4 h-4" />,
//       label: "Sessions",
//       value: tutor.totalBookings,
//     },
//     {
//       icon: <Clock className="w-4 h-4" />,
//       label: "Experience",
//       value: `${tutor.experience}y`,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Tutors
//         </button>

//         <div className={`${color.bg} rounded-2xl px-6 py-6 mb-4`}>
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex items-center gap-4">
//               {tutor.user.image ? (
//                  <Image
//     src={tutor.user.image}
//     alt={tutor.user.name ?? "user"}
//     width={80}
//     height={80}
//     className="w-20 h-20 rounded-2xl object-cover"
//   />
// ): (
//                 <div
//                   className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl bg-card shadow-sm ${color.text}`}
//                 >
//                   {initials}
//                 </div>
//               )}
//               <div>
//                 <h1 className="text-xl font-bold text-foreground">
//                   {tutor.user.name}
//                 </h1>
//                 <p className={`text-sm font-medium mt-1 ${color.text}`}>
//                   {tutor.category?.name} · {tutor.experience} yrs exp
//                 </p>
//               </div>
//             </div>

//             <Badge
//               className={`shrink-0 text-xs ${
//                 tutor.availablity
//                   ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50"
//                   : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50"
//               }`}
//             >
//               {tutor.availablity ? "Available" : "Unavailable"}
//             </Badge>
//           </div>
//         </div>

//         <div className="grid grid-cols-4 gap-3 mb-4">
//           {stats.map((s) => (
//             <div
//               key={s.label}
//               className="bg-muted/40 rounded-xl p-3 flex flex-col items-center gap-1"
//             >
//               <span className="text-muted-foreground">{s.icon}</span>
//               <p className="font-bold text-sm text-foreground">{s.value}</p>
//               <p className="text-[10px] text-muted-foreground">{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {tutor.bio && (
//           <div className="bg-card border border-border rounded-2xl px-5 py-4 mb-4">
//             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
//               About
//             </p>
//             <p className="text-sm text-muted-foreground leading-relaxed">
//               {tutor.bio}
//             </p>
//           </div>
//         )}

//         <Separator className="my-4" />

//         <div className="flex items-center justify-between bg-muted/40 rounded-2xl px-5 py-4">
//           <div>
//             <p className="text-xs text-muted-foreground font-medium">
//               Session Rate
//             </p>
//             <p className="text-2xl font-bold text-foreground mt-0.5">
//               ৳{tutor.hourlyRate}
//               <span className="text-sm font-normal text-muted-foreground">
//                 /hr
//               </span>
//             </p>
//           </div>

//           <Button
//             onClick={() => isStudent && setShowBooking(true)}
//             disabled={!tutor.availablity || !isStudent}
//             className="h-11 px-6 font-semibold"
//           >
//             {!isStudent
//               ? "Login as Student to Book"
//               : tutor.availablity
//                 ? "Book a Session"
//                 : "Unavailable"}
//           </Button>
//         </div>
//       </div>

//       <BookingModal
//         tutor={showBooking ? tutor : null}
//         onClose={() => setShowBooking(false)}
//         onSuccess={() => {
//           setShowBooking(false);
//           router.push("/tutors");
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Users, Clock, BookOpen, ArrowLeft, MapPin, GraduationCap } from "lucide-react";
import { TutorProfile } from "@/services/tutors.service";
import { BookingModal } from "./BookingModal";
import { getCategoryColor } from "@/lib/category/categoryColors";
import Image from "next/image";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={
            s <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
          }
        />
      ))}
    </div>
  );
}

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// Backend _count normalize করা
function normalizeTutor(raw: any) {
  return {
    ...raw,
    totalBookings: raw.totalBookings ?? raw._count?.booking ?? 0,
    totalReview: raw.totalReview ?? raw._count?.review ?? 0,
    averageRating: raw.averageRating ?? 0,
    user: {
      ...raw.user,
      image: raw.user?.image === "https://example.com/avatar.png" ? null : raw.user?.image
    },
    availability: raw.availability ?? raw.availablity ?? raw.isAvailable ?? raw.isAdvailable ?? false,
  };
}

type Props = {
  tutor: TutorProfile & { _count?: { booking: number; review: number } };
  user: { role: string } | null;
};

export default function TutorDetailPage({ tutor: rawTutor, user }: Props) {
  const router = useRouter();
  const tutor = normalizeTutor(rawTutor);
  const isStudent = user?.role === "STUDENT";
  const color = getCategoryColor(tutor.category?.name ?? "default");
  const initials = getInitials(tutor.user.name);

  const [showBooking, setShowBooking] = useState(false);

  const stats = [
    {
      icon: <Star className="w-4 h-4" />,
      label: "Rating",
      value: tutor.averageRating > 0 ? tutor.averageRating.toFixed(1) : "New",
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Reviews",
      value: tutor.totalReview,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Sessions",
      value: tutor.totalBookings,
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Experience",
      value: `${tutor.experience}y`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tutors
        </button>

        {/* Hero Card */}
        <div className={`${color.bg} rounded-2xl px-6 py-6 mb-4`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={tutor.user.image || `https://i.pravatar.cc/256?u=${tutor.id}`}
                alt={tutor.user.name ?? "tutor"}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-background shadow-md"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {tutor.user.name}
                </h1>
                <p className={`text-sm font-medium mt-1 ${color.text}`}>
                  {tutor.category?.name} · {tutor.experience} yrs exp
                </p>
                {/* Available time */}
                {tutor.availableFrom && tutor.availableTo && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tutor.availableFrom} – {tutor.availableTo}
                  </p>
                )}
              </div>
            </div>

            <Badge
              className={`shrink-0 text-xs ${tutor.availability
                ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                }`}
            >
              {tutor.availability ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-muted/40 rounded-xl p-3 flex flex-col items-center gap-1"
            >
              <span className="text-muted-foreground">{s.icon}</span>
              <p className="font-bold text-sm text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {tutor.bio && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              About
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tutor.bio}
            </p>
          </div>
        )}

        {/* Education */}
        {tutor.education && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </p>
            <p className="text-sm text-foreground">{tutor.education}</p>
          </div>
        )}

        {/* Reviews */}
        {tutor.review && tutor.review.length > 0 && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Reviews ({tutor.totalReview})
            </p>
            <div className="space-y-3">
              {tutor.review.slice(0, 3).map((r: any) => (
                <div key={r.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{r.user?.name}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-xs text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Booking Bar */}
        <div className="flex items-center justify-between bg-muted/40 rounded-2xl px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Session Rate</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              ৳{tutor.hourlyRate}
              <span className="text-sm font-normal text-muted-foreground">/hr</span>
            </p>
          </div>

          <Button
            onClick={() => isStudent && setShowBooking(true)}
            disabled={!tutor.availability || !isStudent}
            className="h-11 px-6 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
          >
            {!isStudent
              ? "Login as Student to Book"
              : tutor.availability
                ? "Book a Session"
                : "Unavailable"}
          </Button>
        </div>
      </div>

      <BookingModal
        tutor={showBooking ? tutor : null}
        onClose={() => setShowBooking(false)}
        onSuccess={() => {
          setShowBooking(false);
          router.push("/tutors");
        }}
      />
    </div>
  );
}
