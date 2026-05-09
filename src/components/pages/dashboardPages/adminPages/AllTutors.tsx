/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTutors, TutorProfile } from "@/services/tutors.service";

import Image from "next/image";

function getInitials(name: string = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const colors = [
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
];

function avatarColor(name: string = "") {
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

function TutorCard({ tutor }: { tutor: TutorProfile }) {
  const initials = getInitials(tutor.user?.name);
  const color = avatarColor(tutor.user?.name);
  const rating = Number(tutor.averageRating ?? 0).toFixed(1);
  
  // Filter out the dummy placeholder URL so pravatar fallback kicks in
  const rawImage = tutor.user?.image;
  const image = rawImage === "https://example.com/avatar.png" ? null : rawImage;
  const avatarUrl = image || `https://i.pravatar.cc/150?u=${tutor.user?.email || tutor.id}`;

  const isAvailable = tutor.availability ?? (tutor as any).availablity ?? (tutor as any).isAvailable ?? (tutor as any).isAdvailable ?? false;

  const totalBookings = tutor.totalBookings ?? (tutor as any)._count?.booking ?? 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all duration-200 group">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${color} overflow-hidden shadow-sm relative`}>
            <Image 
              src={avatarUrl} 
              alt={tutor.user?.name || "Tutor"} 
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-foreground text-sm truncate group-hover:text-emerald-600 transition-colors">
              {tutor.user?.name}
            </h2>
            <p className="text-[11px] font-medium text-muted-foreground truncate uppercase tracking-wider">
              {tutor.category?.name ?? "General"}
            </p>
          </div>
        </div>

        {/* Availability Badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md ${
            isAvailable
              ? "bg-primary text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-muted/30 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-foreground text-xs">{rating}</span>
          </div>
          <p className="text-[9px] text-muted-foreground uppercase font-medium">Rating</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2 text-center">
          <p className="font-bold text-foreground text-xs mb-0.5">{tutor.experience}y</p>
          <p className="text-[9px] text-muted-foreground uppercase font-medium">Exp</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2 text-center">
          <p className="font-bold text-foreground text-xs mb-0.5">{tutor.hourlyRate}</p>
          <p className="text-[9px] text-muted-foreground uppercase font-medium">BDT/hr</p>
        </div>
      </div>

      {/* Bio */}
      {tutor.bio && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed h-8">
          {tutor.bio}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border text-[10px] text-muted-foreground font-medium">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {totalBookings} bookings
        </span>
        <span className="truncate max-w-[120px]">{tutor.user?.email}</span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted/60 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted/60 rounded w-4/5" />
    </div>
  );
}

export default function AllTutors() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const h = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 500);
    return () => clearTimeout(h);
  }, [searchTerm]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getTutors({ page, limit: 6, isDeleted: false, searchTerm: debouncedSearch || undefined });
      if (res.error) { toast.error(res.error); setLoading(false); return; }
      setTutors(res.data ?? []);
      setMeta(res.meta);
      setLoading(false);
    };
    load();
  }, [page, debouncedSearch]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-1">
          Admin Panel
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">All Active Tutors</h1>
          {meta && (
            <p className="text-sm text-muted-foreground mb-0.5">
              {meta.total} tutor{meta.total !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-emerald-500 transition-colors w-full"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : tutors.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            <p className="font-medium text-foreground">No tutors found</p>
            <p className="text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutors.map((tutor) => <TutorCard key={tutor.id} tutor={tutor} />)}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-xl">
              ← Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page <span className="font-semibold text-foreground">{page}</span> of {meta.totalPage}
            </span>
            <Button variant="outline" disabled={page === meta.totalPage} onClick={() => setPage((p) => p + 1)} className="rounded-xl">
              Next →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}