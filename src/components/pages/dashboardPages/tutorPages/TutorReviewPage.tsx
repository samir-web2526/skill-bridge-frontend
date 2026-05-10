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
import { AlertCircle, CalendarDays, Inbox, Search } from "lucide-react";
import { getMyReceivedReviews, Review } from "@/services/review.service";

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  const numColor =
    rounded >= 5
      ? "text-primary"
      : rounded >= 4
        ? "text-amber-500"
        : rounded >= 3
          ? "text-amber-500"
          : "text-destructive";
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
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center shrink-0">
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
    <div className="bg-card rounded-xl border border-border px-4 py-3 shadow-sm">
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
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
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
      ? "bg-primary"
      : star === 4
        ? "bg-primary/80"
        : star === 3
          ? "bg-primary/60"
          : "bg-destructive/50";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-3 shrink-0">{star}</span>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-100">
        <div
          className={`h-1.5 rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground w-4 text-right shrink-0">
        {count}
      </span>
    </div>
  );
}

export default function TutorReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getMyReceivedReviews(page);
      if (result.data) {
        setReviews(result.data.data);
        setPaginations(result.data.meta)
      } else {
        setError("Failed to load reviews. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page]);

  const stats = useMemo(() => {
    const total = paginations?.total ?? reviews.length;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
        : 0;
    const fiveStar = reviews.filter((r) => Math.round(r.rating) === 5).length;
    const fourStar = reviews.filter((r) => Math.round(r.rating) === 4).length;
    const threeStar = reviews.filter((r) => Math.round(r.rating) === 3).length;
    const twoStar = reviews.filter((r) => Math.round(r.rating) === 2).length;
    const oneStar = reviews.filter((r) => Math.round(r.rating) === 1).length;
    return {
      total,
      avgRating,
      fiveStar,
      fourStar,
      threeStar,
      twoStar,
      oneStar,
    };
  }, [reviews, paginations]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "5" && Math.round(r.rating) === 5) ||
        (activeFilter === "4" && Math.round(r.rating) === 4) ||
        (activeFilter === "3" && r.rating < 4);
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.user?.email?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [reviews, activeFilter, search]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          Tutor Dashboard
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Reviews
          </h1>
          {paginations && (
            <p className="text-sm text-muted-foreground font-medium mb-0.5">
              {paginations.total} review
              {paginations.total !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-5">
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by student or comment…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors w-52"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "All", value: "all" },
              { label: "5 stars", value: "5" },
              { label: "4 stars", value: "4" },
              { label: "≤ 3 stars", value: "3" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${activeFilter === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                {["Student", "Rating", "Comment", "Date"].map((h, i) => (
                  <TableHead
                    key={i}
                    className={`text-[11px] font-bold tracking-widest text-muted-foreground uppercase py-3 ${i === 0 ? "pl-6" : ""}`}
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
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Inbox size={22} className="text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {search || activeFilter !== "all" ? "No matching reviews found" : "No reviews yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review, idx) => (
                  <TableRow
                    key={review.id}
                    className={`hover:bg-muted/50 transition-colors ${idx % 2 === 1 ? "bg-muted/20" : ""}`}
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <StudentAvatar name={review?.user?.name ?? "?"} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {review?.user?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {review?.user?.email ?? ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <StarRating rating={review.rating} />
                    </TableCell>

                    <TableCell className="py-4 max-w-60">
                      <p className="text-sm text-muted-foreground truncate">
                        {review.comment ?? "—"}
                      </p>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
