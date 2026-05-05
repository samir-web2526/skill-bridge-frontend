
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Inbox, Search } from "lucide-react";
import { TutorProfileDialog } from "./TutorProfile";
import { BookingDialog } from "./BookingDialog";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { createBooking } from "@/services/booking.service";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number | null; count?: number }) {
  // null/undefined/0 হলে "No rating" দেখাও
  if (!rating || rating === 0) {
    return (
      <div>
        <p className="text-xs text-zinc-300 font-medium">No rating</p>
        {count !== undefined && (
          <p className="text-[11px] text-zinc-300 mt-0.5">({count} reviews)</p>
        )}
      </div>
    );
  }

  const rounded = Math.round(rating);
  return (
    <div>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="11" height="11" viewBox="0 0 12 12">
            <polygon
              points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,9 2.5,11 3.5,7 1,4.5 4.5,4.5"
              fill={i < rounded ? "#fbbf24" : "#e5e7eb"}
            />
          </svg>
        ))}
        <span className="text-xs font-semibold text-amber-600 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      </div>
      {count !== undefined && (
        <p className="text-[11px] text-zinc-400 mt-0.5">({count} reviews)</p>
      )}
    </div>
  );
}

function TutorAvatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";
  return (
    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center shrink-0">
      {initials}
    </div>
  );
}

function StatCard({
  label,
  value,
  valueColor,
  starDisplay,
  avgRating,
}: {
  label: string;
  value: string | number;
  dotColor?: string;
  valueColor: string;
  starDisplay?: boolean;
  avgRating?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3 shadow-sm">
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>
      <div className="flex flex-col gap-0.5 mt-0.5">
        {starDisplay && (
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                style={{
                  color: i < Math.round(avgRating ?? 0) ? "#fbbf24" : "#e5e7eb",
                }}
              >
                ★
              </span>
            ))}
          </span>
        )}
        <p className="text-xs text-zinc-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentTutorPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { page, handlePageChange } = usePagination();

  // ── Fetch — REST call directly, "use server" action কে client useEffect থেকে
  //    call না করে সরাসরি API hit করা safe ──
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", "10");
        params.append("isAvailable", "true"); // backend field name

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/tutors?${params.toString()}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (!res.ok) {
          setError(json?.message ?? "Failed to load tutors");
          return;
        }

        setTutors(json?.data?.data ?? []);
        setPaginations(json?.data?.meta ?? null);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [page]);

  // ── Stats — hourlyRate Decimal string থেকে number-এ convert করো ──
  const stats = useMemo(() => {
    const total = paginations?.total ?? tutors.length;
    const rated = tutors.filter((t) => t.averageRating && t.averageRating > 0);
    const avgRating =
      rated.length > 0
        ? rated.reduce((s, t) => s + Number(t.averageRating), 0) / rated.length
        : 0;
    const avgRate =
      tutors.length > 0
        ? Math.round(
            tutors.reduce((s, t) => s + Number(t.hourlyRate ?? 0), 0) /
              tutors.length
          )
        : 0;
    return { total, avgRating, avgRate };
  }, [tutors, paginations]);

  const categories = useMemo(() => {
    const cats = tutors
      .map((t) => t.category?.name)
      .filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(cats))];
  }, [tutors]);

  const filtered = useMemo(() => {
    return tutors.filter((t) => {
      const matchCat =
        activeCategory === "All" || t.category?.name === activeCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.user?.name?.toLowerCase().includes(q) ||
        t.user?.email?.toLowerCase().includes(q) ||
        t.category?.name?.toLowerCase().includes(q) ||
        t.bio?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [tutors, activeCategory, search]);

  const handleBookFromProfile = () => {
    if (!selectedTutor) return;
    setSelectedTutorId(selectedTutor.id);
    setSelectedTutor(null);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async (data: {
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
}) => {
  setIsBookingSubmitting(true);
  const result = await createBooking(data);
  if (result?.error) {
    toast.error(result.error);
  } else {
    toast.success("Booking created!");
    setBookingDialogOpen(false);
    setSelectedTutorId("");
  }
  setIsBookingSubmitting(false);
};

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          My Learning
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Find Tutors
          </h1>
          {paginations && (
            <p className="text-sm text-zinc-400 font-medium mb-0.5">
              {paginations.total} tutor
              {paginations.total !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-5">
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Available tutors"
            value={stats.total}
            valueColor="text-zinc-800"
          />
          <StatCard
            label="Avg rating"
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
            valueColor="text-amber-500"
            starDisplay
            avgRating={stats.avgRating}
          />
          <StatCard
            label="Avg rate/hr"
            value={stats.avgRate > 0 ? `৳${stats.avgRate}` : "—"}
            valueColor="text-emerald-700"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300"
            />
            <input
              type="text"
              placeholder="Search tutors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-300 outline-none focus:border-emerald-400 transition-colors w-52"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                {["Tutor", "Category", "Rate", "Rating", "Exp", ""].map(
                  (h, i) => (
                    <TableHead
                      key={i}
                      className={`text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 ${
                        i === 0 ? "pl-6" : ""
                      } ${i === 5 ? "text-right pr-6" : ""}`}
                    >
                      {h}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 rounded bg-zinc-100" />
                          <div className="h-2.5 w-20 rounded bg-zinc-100" />
                        </div>
                      </div>
                    </TableCell>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-3 w-16 rounded bg-zinc-100" />
                      </TableCell>
                    ))}
                    <TableCell className="py-4 pr-6">
                      <div className="flex justify-end">
                        <div className="h-7 w-20 rounded-lg bg-zinc-100" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Inbox size={22} className="text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        No tutors found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tutor, idx) => {
                  const { bg: catBg, text: catText } = getCategoryColor(
                    tutor.category?.name ?? ""
                  );
                  return (
                    <TableRow
                      key={tutor.id}
                      className={`hover:bg-zinc-50 transition-colors ${
                        idx % 2 === 1 ? "bg-zinc-50/50" : ""
                      }`}
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <TutorAvatar name={tutor.user?.name ?? "?"} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                              {tutor.user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {tutor.user?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${catBg} ${catText}`}
                        >
                          {tutor.category?.name ?? "—"}
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="text-sm font-semibold text-emerald-700">
                          ৳{Number(tutor.hourlyRate).toLocaleString()}/hr
                        </span>
                      </TableCell>

                      <TableCell className="py-4">
                        <StarRating
                          rating={tutor.averageRating}
                          count={tutor.totalReview}
                        />
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="text-sm text-zinc-400">
                          {tutor.experience ? `${tutor.experience} yrs` : "—"}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 pr-6">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => setSelectedTutor(tutor)}
                            className="h-7 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-none px-3"
                            variant="ghost"
                          >
                            View Profile
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {paginations && (
          <div className="pt-2">
            <Pagination
              paginations={paginations}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <TutorProfileDialog
        open={!!selectedTutor}
        tutor={selectedTutor}
        onClose={() => setSelectedTutor(null)}
        onBook={handleBookFromProfile}
      />

      <BookingDialog
        open={bookingDialogOpen}
        mode="create"
        tutors={tutors}
        selectedTutorId={selectedTutorId}
        isSubmitting={isBookingSubmitting}
        onClose={() => setBookingDialogOpen(false)}
        onSubmit={handleBookingSubmit}
        onTutorChange={setSelectedTutorId}
      />
    </div>
  );
}
