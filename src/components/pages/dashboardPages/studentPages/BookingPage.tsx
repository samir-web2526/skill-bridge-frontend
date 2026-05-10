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
import {
  Plus,
  Star,
  CalendarDays,
  AlertCircle,
  Inbox,
  CreditCard,
  CheckCircle2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { cancelBooking, createBooking, getBookings } from "@/services/booking.service";
import { getTutors } from "@/services/tutors.service";
import { createReview } from "@/services/review.service";
import { initializePayment } from "@/services/payment.service";
import { BookingDialog } from "./BookingDialog";
import { ReviewDialog } from "./ReviewDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BookingError = {
  message: string;
  isEmailError?: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { pill: string; dot: string; pulse?: boolean; label: string }
> = {
  PENDING: {
    pill: "bg-muted/50 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
    pulse: true,
    label: "Pending",
  },
  CONFIRMED: {
    pill: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
    label: "Confirmed",
  },
  COMPLETED: {
    pill: "bg-primary text-primary-foreground border-primary",
    dot: "bg-primary-foreground",
    label: "Completed",
  },
  CANCELLED: {
    pill: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
    label: "Cancelled",
  },
};

function StatCard({
  label,
  value,
  dotColor,
  valueColor,
}: {
  label: string;
  value: number;
  dotColor: string;
  valueColor: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border px-4 py-3 shadow-sm">
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        {label}
      </p>
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

export default function StudentBookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  // Booking dialog
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingDialogMode, setBookingDialogMode] = useState<"create" | "cancel">("create");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<BookingError | null>(null);
  const [existingBookingDates, setExistingBookingDates] = useState<string[]>([]);

  // Payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<any | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Review dialog
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { page, handlePageChange } = usePagination();

  // ── Bookings fetch ──
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getBookings({ page, searchTerm: search || undefined });
      if (result.error) {
        setError(result.error);
      } else {
        setBookings(result.data ?? []);
        setPaginations(result.meta);

        const activeDates = (result.data ?? [])
          .filter((b: any) => b.status === "PENDING" || b.status === "CONFIRMED")
          .map((b: any) => new Date(b.date).toISOString().split("T")[0]);
        setExistingBookingDates(activeDates);
      }
      setIsLoading(false);
    };
    load();
  }, [page, refresh, search]);


  const stats = useMemo(
    () => ({
      total: paginations?.total ?? bookings.length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
      confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    }),
    [bookings, paginations],
  );

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = activeFilter === "All" || b.status === activeFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.tutor?.user?.name?.toLowerCase().includes(q) ||
        b.tutor?.user?.email?.toLowerCase().includes(q) ||
        b.tutor?.category?.name?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, activeFilter, search]);

  // ── Booking handlers ──
  const openCreateDialog = async () => {
    const result = await getTutors({ limit: 15 });
    setTutors(result.data ?? []);
    setSelectedTutorId("");
    setBookingDialogMode("create");
    setSelectedBooking(null);
    setBookingError(null);
    setBookingDialogOpen(true);
  };

  const openCancelDialog = (booking: any) => {
    setSelectedBooking(booking);
    setBookingDialogMode("cancel");
    setBookingError(null);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async (data?: {
    tutorId: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    setIsBookingSubmitting(true);
    setBookingError(null);

    if (bookingDialogMode === "create") {
      if (!data) return;
      const result = await createBooking({
        tutorId: data.tutorId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      if (result?.error) {
        const message = result.error;
        const isEmailError =
          message.toLowerCase().includes("verify") ||
          message.toLowerCase().includes("email");
        setBookingError({ message, isEmailError });
        if (!isEmailError) toast.error(message);
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
        setBookingError({ message: result.error });
        toast.error(result.error);
      } else {
        toast.success("Booking cancelled.");
        setBookingDialogOpen(false);
        setRefresh((prev) => prev + 1);
      }
    }

    setIsBookingSubmitting(false);
  };

  // ── Payment handlers ──
  const openPaymentModal = (booking: any) => {
    setPaymentTarget(booking);
    setPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    if (!paymentTarget) return;
    setIsPaymentLoading(true);
    const result = await initializePayment(paymentTarget.id);
    if (result.error) {
      toast.error(result.error);
    } else if (result.data?.checkoutUrl) {
      window.location.href = result.data.checkoutUrl;
    }
    setIsPaymentLoading(false);
  };

  // ── Review handlers ──
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
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          My Learning
        </p>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              My Bookings
            </h1>
            {paginations && (
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                {paginations.total} booking
                {paginations.total !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold px-4 flex items-center gap-2 shadow-sm shadow-primary/20"
          >
            <Plus size={15} />
            New Booking
          </Button>
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
              placeholder="Search by tutor or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors w-52"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${activeFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                  }`}
              >
                {s === "All" ? "All" : (STATUS_CONFIG[s]?.label ?? s)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                {["Tutor", "Category", "Rate", "Status", "Date", "Actions"].map((h, i) => (
                  <TableHead
                    key={i}
                    className={`text-[11px] font-bold tracking-widest text-muted-foreground uppercase py-3 ${i === 0 ? "pl-6" : ""} ${i === 5 ? "text-right pr-6" : ""}`}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
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
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-3 w-20 rounded bg-muted" />
                      </TableCell>
                    ))}
                    <TableCell className="py-4 pr-6">
                      <div className="flex justify-end">
                        <div className="h-7 w-16 rounded-lg bg-muted" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Inbox size={22} className="text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {search || activeFilter !== "All" ? "No matching bookings found" : "No bookings yet"}
                      </p>
                      {!search && activeFilter === "All" && (
                        <Button
                          onClick={openCreateDialog}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold px-4 mt-1"
                        >
                          Book your first tutor
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((booking, idx) => {
                  const statusCfg = STATUS_CONFIG[booking.status] ?? {
                    pill: "bg-muted text-muted-foreground border-border",
                    dot: "bg-muted-foreground/50",
                    label: booking.status,
                  };

                  // ── Action flags ──
                  const canCancel = booking.status === "PENDING" && booking.payment?.status !== "PAID";
                  const canPay = booking.status === "PENDING" && (!booking.payment || booking.payment.status !== "PAID");
                  const isPaid = booking.payment?.status === "PAID" || booking.status === "CONFIRMED";
                  const canReview = booking.status === "COMPLETED" && !booking.review;
                  const hasReview = booking.status === "COMPLETED" && !!booking.review;
                  const showDash = !canCancel && !canPay && !isPaid && !canReview && !hasReview;

                  return (
                    <TableRow
                      key={booking.id}
                      className={`hover:bg-muted/30 transition-colors ${idx % 2 === 1 ? "bg-muted/5" : ""}`}
                    >
                      {/* Tutor */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <TutorAvatar name={booking.tutor?.user?.name ?? "?"} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {booking.tutor?.user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {booking.tutor?.user?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-4">
                        <span className="text-sm text-muted-foreground">
                          {booking.tutor?.category?.name ?? "—"}
                        </span>
                      </TableCell>

                      {/* Rate */}
                      <TableCell className="py-4">
                        <span className="text-sm font-semibold text-primary">
                          {booking.tutor?.hourlyRate
                            ? `৳${Number(booking.tutor.hourlyRate).toLocaleString()}/hr`
                            : "—"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot} ${statusCfg.pulse ? "animate-pulse" : ""}`} />
                          {statusCfg.label}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays size={13} className="text-zinc-300 shrink-0" />
                          {new Date(booking.date ?? booking.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {canCancel && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openCancelDialog(booking)}
                              className="h-7 text-xs font-semibold rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none px-3"
                            >
                              Cancel
                            </Button>
                          )}

                          {canPay && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openPaymentModal(booking)}
                              className="h-7 text-xs font-semibold rounded-lg border border-chart-1/20 bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 shadow-none px-3 flex items-center gap-1"
                            >
                              <CreditCard size={11} />
                              Pay Now
                            </Button>
                          )}

                          {isPaid && (
                            <span className="text-xs text-chart-1 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={11} className="text-chart-1" />
                              Paid
                            </span>
                          )}

                          {canReview && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openReviewDialog(booking)}
                              className="h-7 text-xs font-semibold rounded-lg border border-chart-2/20 bg-chart-2/10 text-chart-2 hover:bg-chart-2/20 shadow-none px-3 flex items-center gap-1"
                            >
                              <Star size={11} className="fill-chart-2 text-chart-2" />
                              Review
                            </Button>
                          )}

                          {hasReview && (
                            <span className="text-xs text-primary font-semibold flex items-center gap-1">
                              <Star size={11} className="fill-primary text-primary" />
                              Reviewed
                            </span>
                          )}

                          {showDash && (
                            <span className="text-xs text-zinc-300 font-medium">—</span>
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
          <div className="pt-2">
            <Pagination paginations={paginations} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* ── Booking Dialog ── */}
      <BookingDialog
        open={bookingDialogOpen}
        mode={bookingDialogMode}
        tutors={tutors}
        selectedTutorId={selectedTutorId}
        cancelTutorName={selectedBooking?.tutor?.user?.name ?? ""}
        isSubmitting={isBookingSubmitting}
        error={bookingError}
        onClose={() => setBookingDialogOpen(false)}
        onSubmit={handleBookingSubmit}
        onTutorChange={setSelectedTutorId}
        existingBookingDates={existingBookingDates}
      />

      {/* ── Review Dialog ── */}
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

      {/* ── Payment Modal ── */}
      <Dialog open={paymentModalOpen} onOpenChange={() => setPaymentModalOpen(false)}>
        <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden rounded-2xl border">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-base font-bold">Complete Payment</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-xl bg-muted/20 border border-border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tutor</span>
                <span className="font-semibold text-foreground">
                  {paymentTarget?.tutor?.user?.name ?? "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-zinc-700">
                  {paymentTarget?.date
                    ? new Date(paymentTarget.date).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="text-zinc-700">
                  {paymentTarget?.startTime} – {paymentTarget?.endTime}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2 mt-1">
                <span className="text-muted-foreground font-medium">Amount</span>
                <span className="font-extrabold text-primary text-base">
                  {paymentTarget?.tutor?.hourlyRate
                    ? `৳${Number(paymentTarget.tutor.hourlyRate).toLocaleString()}`
                    : "—"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to Stripe to complete the payment securely.
            </p>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setPaymentModalOpen(false)}
              disabled={isPaymentLoading}
            >
              Close
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isPaymentLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <CreditCard size={14} />
              {isPaymentLoading ? "Redirecting..." : "Pay with Stripe"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}