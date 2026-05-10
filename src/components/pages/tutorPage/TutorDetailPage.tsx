"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Users, Clock, BookOpen, ArrowLeft, MapPin, GraduationCap, ArrowRight, ImageIcon } from "lucide-react";
import { TutorProfile } from "@/services/tutors.service";
import { BookingModal } from "./BookingModal";
import { getCategoryColor } from "@/lib/category/categoryColors";
import Image from "next/image";
import Link from "next/link";

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
  relatedTutors?: (TutorProfile & { _count?: { booking: number; review: number } })[];
};

export default function TutorDetailPage({ tutor: rawTutor, user, relatedTutors = [] }: Props) {
  const router = useRouter();
  const tutor = normalizeTutor(rawTutor);
  const isStudent = user?.role === "STUDENT";
  const color = getCategoryColor(tutor.category?.name ?? "default");

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tutors
        </button>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative w-32 h-32 shrink-0">
                <Image
                  src={tutor.user.image || `https://i.pravatar.cc/256?u=${tutor.id}`}
                  alt={tutor.user.name}
                  fill
                  className="rounded-3xl object-cover border-4 border-card shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold tracking-tight">{tutor.user.name}</h1>
                  <Badge className="bg-primary/10 text-primary border-none px-3 py-0.5 rounded-full text-[10px] font-bold">
                    VERIFIED TUTOR
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Dhaka, Bangladesh</span>
                  <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-primary" /> {tutor.category?.name} Expert</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {tutor.experience} Years Experience</span>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" /> Portfolio & Media
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop`,
                  `https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop`,
                  `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop`,
                ].map((img, i) => (
                  <div key={i} className="aspect-video relative rounded-2xl overflow-hidden border border-border group">
                    <Image src={img} alt="Tutor Portfolio" fill className="object-cover transition-transform group-hover:scale-105 duration-500" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">Description / Overview</h2>
              <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {tutor.bio || `Welcome to my profile! I am a dedicated educator with over ${tutor.experience} years of experience in teaching ${tutor.category?.name}. My teaching philosophy centers on making complex concepts accessible and engaging for students of all levels. \n\nI offer personalized study plans, interactive problem-solving sessions, and regular progress assessments to ensure my students achieve their academic goals. Whether you are preparing for exams or looking to strengthen your foundations, I am here to guide you every step of the way.`}
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">Key Information / Specifications</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Subjects", value: tutor.category?.name || "General Science" },
                  { label: "Education", value: tutor.education || "Bachelor's Degree" },
                  { label: "Language", value: "English, Bengali" },
                  { label: "Level", value: "Class 6-12, College" },
                  { label: "Platform", value: "Online, In-person" },
                  { label: "Response Time", value: "< 1 Hour" },
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{spec.label}</span>
                    <span className="text-sm font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Reviews & Ratings</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Star size={14} className="fill-primary text-primary" />
                  <span className="text-sm font-bold text-primary">{tutor.averageRating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {tutor.review && tutor.review.length > 0 ? (
                  tutor.review.map((r: any) => (
                    <div key={r.id} className="p-6 rounded-3xl border border-border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {r.user?.name?.[0] || "S"}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{r.user?.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">Verified Student</p>
                          </div>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">"{r.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-muted/20 rounded-3xl border border-dashed border-border">
                    <p className="text-muted-foreground italic">No reviews yet. Be the first to review this tutor!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-primary/5">
                <div className="mb-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Hourly Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">৳{tutor.hourlyRate}</span>
                    <span className="text-muted-foreground font-medium">/ hour</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {s.icon} <span>{s.label}</span>
                      </div>
                      <span className="font-bold">{s.value}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {isStudent ? (
                  <Button
                    onClick={() => setShowBooking(true)}
                    disabled={!tutor.availability}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    {tutor.availability ? "Book a Session" : "Currently Unavailable"}
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    <Link href="/login">Login to Book</Link>
                  </Button>
                )}

                <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium uppercase tracking-tighter">
                  Guaranteed safe session booking
                </p>
              </div>

              <div className="bg-primary rounded-3xl p-6 text-primary-foreground overflow-hidden relative group">
                <div className="relative z-10">
                  <p className="text-xs font-bold opacity-80 uppercase mb-1">Need help?</p>
                  <h3 className="font-bold text-lg mb-3">Live Chat Support</h3>
                  <Button variant="secondary" size="sm" className="rounded-full bg-background text-primary font-bold hover:bg-background/90">
                    Chat Now
                  </Button>
                </div>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>

        {relatedTutors && relatedTutors.length > 0 && (
          <section className="mt-20 pt-16 border-t border-border">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Similar Options</p>
                <h2 className="text-3xl font-extrabold tracking-tight">Related Tutors</h2>
              </div>
              <Button asChild variant="ghost" className="font-bold text-primary hover:text-primary/90">
                <Link href="/tutors">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTutors.map((rel: any) => (
                <Link key={rel.id} href={`/tutors/${rel.id}`}>
                  <div className="p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-all group flex items-center gap-4">
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={(rel.user?.image && rel.user.image !== "https://example.com/avatar.png") ? rel.user.image : `https://i.pravatar.cc/256?u=${rel.id}`}
                        alt={rel.user?.name || "Tutor Avatar"}
                        fill
                        className="rounded-2xl object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold group-hover:text-primary transition-colors">{rel.user?.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{rel.category?.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star size={12} className="fill-current" /> {rel.averageRating || "5.0"}
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">৳{rel.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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

