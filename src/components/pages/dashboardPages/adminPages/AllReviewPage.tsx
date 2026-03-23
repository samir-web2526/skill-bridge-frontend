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
import { Button } from "@/components/ui/button";
import { deleteReview, getAllReviews } from "@/lib/auth/adminActions/actions";
import {
  AlertCircle,
  CalendarDays,
  Inbox,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

function InitialAvatar({
  name,
  variant = "emerald",
}: {
  name: string;
  variant?: "emerald" | "zinc";
}) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
        variant === "emerald"
          ? "bg-emerald-700 text-white"
          : "bg-zinc-100 text-zinc-600"
      }`}
    >
      {initials}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-3 h-3"
          fill={i < Math.round(rating) ? "#fbbf24" : "#e5e7eb"}
          stroke={i < Math.round(rating) ? "#fbbf24" : "#e5e7eb"}
        />
      ))}
      <span className="text-xs font-semibold text-zinc-700 ml-1">
        {Number(rating).toFixed(1)}
      </span>
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
          className={`h-1.5 rounded-full ${barColor} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-zinc-400 w-4 text-right shrink-0">
        {count}
      </span>
    </div>
  );
}

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "5 stars", value: "5" },
  { label: "4 stars", value: "4" },
  { label: "≤ 3 stars", value: "3" },
];

export default function AdminReviewsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getAllReviews(page);
      if (result) {
        setReviews(result.data);
        setPaginations(result.paginations);
      } else {
        setError("Failed to load reviews. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page, refresh]);

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (result?.error) {
      toast.error(
        "Category already assigned to a tutor. Please select another category.",
      );
    } else {
      toast.success("Review deleted.");
      setRefresh((prev) => prev + 1);
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avgRating =
      total > 0 ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / total : 0;
    const fiveStar = reviews.filter((r) => Math.round(r.rating) === 5).length;
    const fourStar = reviews.filter((r) => Math.round(r.rating) === 4).length;
    const threeStar = reviews.filter((r) => Math.round(r.rating) === 3).length;
    const twoStar = reviews.filter((r) => Math.round(r.rating) === 2).length;
    const oneStar = reviews.filter((r) => Math.round(r.rating) === 1).length;
    const belowFour = reviews.filter((r) => r.rating < 4).length;
    return {
      total,
      avgRating,
      fiveStar,
      fourStar,
      threeStar,
      twoStar,
      oneStar,
      belowFour,
    };
  }, [reviews]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "5" && Math.round(r.rating) === 5) ||
        (activeFilter === "4" && Math.round(r.rating) === 4) ||
        (activeFilter === "3" && r.rating < 4);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.user?.email?.toLowerCase().includes(q) ||
        r.tutor?.user?.name?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [reviews, activeFilter, search]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Admin
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            All Reviews
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 min-w-0">
            <StatCard
              label="Total reviews"
              value={paginations?.total ?? stats.total}
              dotColor="bg-zinc-300"
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
              label="5-star reviews"
              value={stats.fiveStar}
              dotColor="bg-emerald-400"
              valueColor="text-emerald-700"
            />
            <StatCard
              label="Below 4 stars"
              value={stats.belowFour}
              dotColor="bg-amber-400"
              valueColor="text-amber-700"
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
                    total={stats.total}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300"
            />
            <input
              type="text"
              placeholder="Search reviews…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-300 outline-none focus:border-emerald-400 transition-colors w-52"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === f.value
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                {["Student", "Tutor", "Rating", "Comment", "Date", ""].map(
                  (h, i) => (
                    <TableHead
                      key={i}
                      className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 first:pl-6"
                    >
                      {h}
                    </TableHead>
                  ),
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
                    <TableCell className="py-4">
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
                    <TableCell className="py-4">
                      <div className="h-7 w-7 rounded-lg bg-zinc-100" />
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
                        No reviews found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review, idx) => (
                  <TableRow
                    key={review.id}
                    className={`hover:bg-zinc-50 transition-colors ${
                      idx % 2 === 1 ? "bg-zinc-50/50" : ""
                    }`}
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <InitialAvatar
                          name={review.user?.name ?? "?"}
                          variant="emerald"
                        />
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
                      <div className="flex items-center gap-3">
                        <InitialAvatar
                          name={review.tutor?.user?.name ?? "?"}
                          variant="zinc"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-800 truncate">
                            {review.tutor?.user?.name ?? "—"}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {review.tutor?.user?.email ?? ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <StarRating rating={review.rating} />
                    </TableCell>

                    <TableCell className="py-4 max-w-50">
                      <p className="text-sm text-zinc-500 truncate">
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

                    <TableCell className="py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        className="h-8 w-8 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
