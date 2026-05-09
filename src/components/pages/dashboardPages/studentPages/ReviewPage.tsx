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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CalendarDays, AlertCircle, Inbox, Search } from "lucide-react";
import { toast } from "sonner";
import { ReviewDialog } from "./ReviewDialog";
import { deleteReview, getMyGivenReviews, Review, updateReview } from "@/services/review.service";

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
            fill={i < rounded ? "#fbbf24" : "var(--muted)"}
          />
        </svg>
      ))}
      <span className={`text-xs font-semibold ml-1 ${numColor}`}>
        {Number(rating).toFixed(1)}
      </span>
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
                  color: i < Math.round(avgRating ?? 0) ? "#fbbf24" : "var(--muted)",
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

export default function StudentReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getMyGivenReviews(page);
      if (result.data) {
        setReviews(result.data?.data);
        setPaginations(result.data.meta);
      } else {
        setError("Failed to load reviews. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page, refresh]);

  const stats = useMemo(() => {
    const total = paginations?.total ?? reviews.length;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length
        : 0;
    const fiveStar = reviews.filter((r) => Math.round(r.rating) === 5).length;
    return { total, avgRating, fiveStar };
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
        r.tutor?.user?.name?.toLowerCase().includes(q) ||
        r.tutor?.user?.email?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [reviews, activeFilter, search]);

  const openEditDialog = (review: any) => {
    setSelectedReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment ?? "");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedReview) return;
    setIsSubmitting(true);
    const result = await updateReview(selectedReview.id, {
      rating: editRating,
      comment: editComment.trim(),
    });
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Review updated!");
      setDialogOpen(false);
      setRefresh((prev) => prev + 1);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Review deleted.");
      // ✅ Review delete হলে list refresh → booking page এ পরের বার "Review" button দেখাবে
      setRefresh((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          My Learning
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
              placeholder="Search by tutor or comment…"
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
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                {["Tutor", "Rating", "Comment", "Date", "Actions"].map((h, i) => (
                  <TableHead
                    key={i}
                    className={`text-[11px] font-bold tracking-widest text-muted-foreground uppercase py-3 ${i === 0 ? "pl-6" : ""} ${i === 4 ? "text-right pr-6" : ""}`}
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
                        <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 rounded bg-muted" />
                          <div className="h-2.5 w-20 rounded bg-muted" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-20 rounded bg-muted" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-40 rounded bg-muted" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-20 rounded bg-muted" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <div className="h-7 w-7 rounded-lg bg-muted" />
                        <div className="h-7 w-7 rounded-lg bg-muted" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Inbox size={22} className="text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {search || activeFilter !== "all" ? "No matching reviews found" : "No reviews yet"}
                      </p>
                      {!search && activeFilter === "all" && (
                        <p className="text-xs text-muted-foreground">
                          Complete a session to write your first review.
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review, idx) => (
                  <TableRow
                    key={review.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <TutorAvatar name={review.tutor?.user?.name ?? "?"} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {review.tutor?.user?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {review.tutor?.user?.email ?? ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <StarRating rating={review.rating} />
                    </TableCell>

                    <TableCell className="py-4 max-w-50">
                      <p className="text-sm text-muted-foreground truncate">
                        {review.comment ?? "—"}
                      </p>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays size={13} className="text-muted-foreground shrink-0" />
                        {new Date(review.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(review)}
                          className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(review.id)}
                          className="h-8 w-8 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 size={13} />
                        </Button>
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

      <ReviewDialog
        open={dialogOpen}
        mode="edit"
        tutorName={selectedReview?.tutor?.user?.name ?? ""}
        rating={editRating}
        comment={editComment}
        isSubmitting={isSubmitting}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        onRatingChange={setEditRating}
        onCommentChange={setEditComment}
      />
    </div>
  );
}