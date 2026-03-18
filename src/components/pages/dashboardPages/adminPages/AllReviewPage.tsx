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
import { Trash2, Star } from "lucide-react";
import { getAllReviews } from "@/lib/auth/adminActions/actions";

export default function AdminReviewsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [page]);

//   const handleDelete = async (reviewId: string) => {
//     const result = await deleteReview(reviewId);
//     if (result) {
//       setReviews((prev) => prev.filter((r) => r.id !== reviewId));
//     }
//   };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Reviews</h1>
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
              <TableHead>Student</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{review.user?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{review.user?.email ?? ""}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{review.tutor?.user?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{review.tutor?.user?.email ?? ""}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{review.rating}</span>
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      // onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginations && (
        <Pagination
          paginations={paginations}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}