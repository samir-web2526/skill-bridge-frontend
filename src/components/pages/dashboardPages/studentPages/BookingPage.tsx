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
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import {
  cancelBooking,
  createBooking,
  createReview,
  getAvailableTutors,
  getMyBookings,
} from "@/lib/auth/studentActions/actions";
import { BookingDialog } from "./BookingDialog";
import { ReviewDialog } from "./ReviewDialog";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default function StudentBookingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingDialogMode, setBookingDialogMode] = useState<
    "create" | "cancel"
  >("create");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviewTarget, setReviewTarget] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getMyBookings(page);

      if (result) {
        setBookings(result.data);
        console.log(result.data);
        setPaginations(result.paginations);
      } else {
        setError("Failed to load bookings. Please try again.");
      }

      setIsLoading(false);
    };

    load();
  }, [page, refresh]);

  const openCreateDialog = async () => {
    const result = await getAvailableTutors(1, 50);
    setTutors(result?.data ?? []);
    setSelectedTutorId("");
    setBookingDialogMode("create");
    setSelectedBooking(null);
    setBookingDialogOpen(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openCancelDialog = (booking: any) => {
    setSelectedBooking(booking);
    setBookingDialogMode("cancel");
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async () => {
    setIsBookingSubmitting(true);

    if (bookingDialogMode === "create") {
      if (!selectedTutorId) return;
      const result = await createBooking({
        tutorId: selectedTutorId,
        date: new Date().toISOString(),
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Booking created!");
        setBookingDialogOpen(false);
        setRefresh((prev) => prev + 1);
      }
    }

    if (bookingDialogMode === "cancel") {
      if (!selectedBooking) return;
      const result = await cancelBooking(selectedBooking.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Booking cancelled.");
        setBookingDialogOpen(false);
        setRefresh((prev) => prev + 1);
      }
    }

    setIsBookingSubmitting(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openReviewDialog = (booking: any) => {
    setReviewTarget(booking);
    setReviewRating(5);
    setReviewComment("");
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!reviewTarget || !reviewComment.trim()) return;
    setIsReviewSubmitting(true);
    const result = await createReview({
      bookingId: reviewTarget.id,
      tutorId: reviewTarget.tutor.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Review submitted!");
      setReviewDialogOpen(false);
      setRefresh((prev) => prev + 1);
    }
    setIsReviewSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {paginations
              ? `${paginations.total} booking${paginations.total !== 1 ? "s" : ""} found`
              : ""}
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
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
              <TableHead>Category</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const canCancel = booking.status === "PENDING";
                const canReview =
                  booking.status === "COMPLETED" && !booking.review;
                const hasReview =
                  booking.status === "COMPLETED" && booking.review;

                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <p className="font-medium text-sm">
                        {booking.tutor?.user?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.tutor?.user?.email ?? ""}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.tutor?.category?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.tutor?.hourlyRate
                        ? `৳${booking.tutor.hourlyRate}/hr`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[booking.status] ?? "bg-zinc-100 text-zinc-600"}`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(
                        booking.date ?? booking.createdAt,
                      ).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
                            onClick={() => openCancelDialog(booking)}
                          >
                            Cancel
                          </Button>
                        )}
                        {canReview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 text-xs gap-1"
                            onClick={() => openReviewDialog(booking)}
                          >
                            <Star className="w-3 h-3" />
                            Review
                          </Button>
                        )}
                        {hasReview && (
                          <span className="text-xs text-muted-foreground px-2">
                            ★ Reviewed
                          </span>
                        )}
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
        <Pagination paginations={paginations} onPageChange={handlePageChange} />
      )}

      <BookingDialog
        open={bookingDialogOpen}
        mode={bookingDialogMode}
        tutors={tutors}
        selectedTutorId={selectedTutorId}
        cancelTutorName={selectedBooking?.tutor?.user?.name ?? ""}
        isSubmitting={isBookingSubmitting}
        onClose={() => setBookingDialogOpen(false)}
        onSubmit={handleBookingSubmit}
        onTutorChange={setSelectedTutorId}
      />

      <ReviewDialog
        open={reviewDialogOpen}
        mode="create"
        tutorName={reviewTarget?.tutor?.user?.name ?? ""}
        rating={reviewRating}
        comment={reviewComment}
        isSubmitting={isReviewSubmitting}
        onClose={() => setReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        onRatingChange={setReviewRating}
        onCommentChange={setReviewComment}
      />
    </div>
  );
}
