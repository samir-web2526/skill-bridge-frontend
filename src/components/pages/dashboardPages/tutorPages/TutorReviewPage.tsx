/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Pagination, PaginationMeta } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CalendarDays, Inbox } from "lucide-react";
import { getTutorReviews } from "@/lib/auth/tutorActions/actions";

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  const numColor =
    rounded >= 5
      ? "text-emerald-600"
      : rounded >= 4
        ? "text-amber-500"
        : rounded >= 3
          ? "text-amber-500"
          : "text-red-500";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,9 2.5,11 3.5,7 1,4.5 4.5,4.5"
            fill={i < rounded ? "#fbbf24" : "#e5e7eb"}
          />
        </svg>
      ))}
      <span className={`text-xs font-semibold ml-1 ${numColor}`}>
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
}

function StudentAvatar({ name }: { name: string }) {
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
  dotColor,
  valueColor,
  starDisplay,
}: {
  label: string;
  value: string | number;
  dotColor?: string;
  valueColor: string;
  starDisplay?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3 shadow-sm">
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-xs text-zinc-400 font-medium mt-0.5 flex items-center gap-1.5">
        {starDisplay ? (
          <span className="text-amber-400 text-xs">★★★★★</span>
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        )}
        {label}
      </p>
    </div>
  );
}

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const barColor =
    star === 5
      ? "bg-emerald-500"
      : star === 4
        ? "bg-emerald-300"
        : star === 3
          ? "bg-amber-400"
          : "bg-red-300";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-zinc-400 w-3 shrink-0">{star}</span>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-100">
        <div
          className={`h-1.5 rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-zinc-400 w-4 text-right shrink-0">
        {count}
      </span>
    </div>
  );
}

export default function TutorReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getTutorReviews(page);
      if (result) {
        setReviews(result.data);
        setPaginations(result.paginations);
      } else {
        setError("Failed to load reviews. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page]);

  const stats = useMemo(() => {
    const total = paginations?.total ?? reviews.length;
    const avg =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
        : 0;
    const fiveStar = reviews.filter((r) => Math.round(r.rating) === 5).length;
    const fourStar = reviews.filter((r) => Math.round(r.rating) === 4).length;
    const threeStar = reviews.filter((r) => Math.round(r.rating) === 3).length;
    const twoStar = reviews.filter((r) => Math.round(r.rating) === 2).length;
    const oneStar = reviews.filter((r) => Math.round(r.rating) === 1).length;
    return { total, avg, fiveStar, fourStar, threeStar, twoStar, oneStar };
  }, [reviews, paginations]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Tutor Dashboard
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            My Reviews
          </h1>
          {paginations && (
            <p className="text-sm text-zinc-400 font-medium mb-0.5">
              {paginations.total} review
              {paginations.total !== 1 ? "s" : ""} total
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

        <div className="flex gap-3 flex-wrap items-start">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 min-w-0">
            <StatCard
              label="Total reviews"
              value={stats.total}
              dotColor="bg-zinc-300"
              valueColor="text-zinc-800"
            />
            <StatCard
              label="Avg rating"
              value={stats.avg > 0 ? stats.avg.toFixed(1) : "—"}
              valueColor="text-amber-500"
              starDisplay
            />
            <StatCard
              label="5-star reviews"
              value={stats.fiveStar}
              dotColor="bg-emerald-500"
              valueColor="text-emerald-700"
            />
          </div>

          <div className="bg-white rounded-xl border border-zinc-100 shadow-sm px-4 py-3 w-full sm:w-44 shrink-0">
            <p className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-3">
              Breakdown
            </p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((s) => {
                const count =
                  s === 5
                    ? stats.fiveStar
                    : s === 4
                      ? stats.fourStar
                      : s === 3
                        ? stats.threeStar
                        : s === 2
                          ? stats.twoStar
                          : stats.oneStar;
                return (
                  <RatingBar
                    key={s}
                    star={s}
                    count={count}
                    total={reviews.length}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                {["Student", "Rating", "Comment", "Date"].map((h, i) => (
                  <TableHead
                    key={i}
                    className={`text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 ${i === 0 ? "pl-6" : ""}`}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
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
                    <TableCell className="py-4">
                      <div className="h-3 w-20 rounded bg-zinc-100" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-40 rounded bg-zinc-100" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-20 rounded bg-zinc-100" />
                    </TableCell>
                  </TableRow>
                ))
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Inbox size={22} className="text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        No reviews yet
                      </p>
                      <p className="text-xs text-zinc-300">
                        Complete sessions to start receiving reviews.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review, idx) => (
                  <TableRow
                    key={review.id}
                    className={`hover:bg-zinc-50 transition-colors ${idx % 2 === 1 ? "bg-zinc-50/50" : ""}`}
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <StudentAvatar name={review.user?.name ?? "?"} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-800 truncate">
                            {review.user?.name ?? "—"}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {review.user?.email ?? ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <StarRating rating={review.rating} />
                    </TableCell>

                    <TableCell className="py-4 max-w-60">
                      <p className="text-sm text-zinc-400 truncate">
                        {review.comment ?? "—"}
                      </p>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <CalendarDays
                          size={13}
                          className="text-zinc-300 shrink-0"
                        />
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-BD",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
}
