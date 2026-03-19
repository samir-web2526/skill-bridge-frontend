"use client";

import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Star } from "lucide-react";

import { toast } from "sonner";
import {
  deleteReview,
  getMyReviews,
  updateReview,
} from "@/lib/auth/studentActions/actions";
import { ReviewDialog } from "./ReviewDialog";

export default function StudentReviewPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getMyReviews(page);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      setRefresh((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {paginations
            ? `${paginations.total} review${paginations.total !== 1 ? "s" : ""} found`
            : ""}
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead>Tutor</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-10"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-10"
                >
                  No reviews found. Complete a session to write a review.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <p className="font-medium text-sm">
                      {review.tutor?.user?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.tutor?.user?.email ?? ""}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {review.rating}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-50 truncate">
                    {review.comment ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                        onClick={() => openEditDialog(review)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
        <Pagination paginations={paginations} onPageChange={handlePageChange} />
      )}

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
