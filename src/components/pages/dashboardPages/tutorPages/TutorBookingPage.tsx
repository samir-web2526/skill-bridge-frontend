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
import { AlertCircle, CalendarDays, Inbox, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getTutorBookings,
  updateTutorBookingStatus,
} from "@/lib/auth/tutorActions/actions";

const STATUS_CONFIG: Record<
  string,
  { pill: string; dot: string; pulse?: boolean; label: string }
> = {
  PENDING: {
    pill: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-400",
    pulse: true,
    label: "Pending",
  },
  CONFIRMED: {
    pill: "bg-blue-50 text-blue-800 border-blue-200",
    dot: "bg-blue-400",
    label: "Confirmed",
  },
  COMPLETED: {
    pill: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  CANCELLED: {
    pill: "bg-red-50 text-red-800 border-red-200",
    dot: "bg-red-400",
    label: "Cancelled",
  },
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
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
    <div className="bg-white rounded-xl border border-zinc-100 px-4 py-3 shadow-sm">
      <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-xs text-zinc-400 font-medium mt-0.5 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        {label}
      </p>
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

export default function TutorBookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getTutorBookings(page);
      if (result) {
        setBookings(result.data);
        setPaginations(result.paginations);
      } else {
        setError("Failed to load bookings. Please try again.");
      }
      setIsLoading(false);
    };
    load();
  }, [page]);
  const stats = useMemo(
    () => ({
      total: paginations?.total ?? bookings.length,
      confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
    }),
    [bookings, paginations],
  );

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const result = await updateTutorBookingStatus(bookingId, newStatus);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Status updated!");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Tutor Dashboard
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            My Bookings
          </h1>
          {paginations && (
            <p className="text-sm text-zinc-400 font-medium mb-0.5">
              {paginations.total} booking
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total"
            value={stats.total}
            dotColor="bg-zinc-300"
            valueColor="text-zinc-800"
          />
          <StatCard
            label="Confirmed"
            value={stats.confirmed}
            dotColor="bg-blue-400"
            valueColor="text-blue-700"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            dotColor="bg-amber-400"
            valueColor="text-amber-700"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            dotColor="bg-emerald-500"
            valueColor="text-emerald-700"
          />
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                {["Student", "Status", "Date", "Update status"].map((h, i) => (
                  <TableHead
                    key={i}
                    className={`text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 ${i === 0 ? "pl-6" : ""} ${i === 3 ? "text-right pr-6" : ""}`}
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
                        <div className="w-8 h-8 rounded-full bg-zinc-100 shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 rounded bg-zinc-100" />
                          <div className="h-2.5 w-20 rounded bg-zinc-100" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-5 w-20 rounded-full bg-zinc-100" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="h-3 w-24 rounded bg-zinc-100" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <div className="h-7 w-20 rounded-lg bg-zinc-100" />
                        <div className="h-7 w-7 rounded-lg bg-zinc-100" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Inbox size={22} className="text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        No bookings yet
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking, idx) => {
                  const status = STATUS_CONFIG[booking.status] ?? {
                    pill: "bg-zinc-100 text-zinc-600 border-zinc-200",
                    dot: "bg-zinc-400",
                    label: booking.status,
                  };
                  const allowedNext = ALLOWED_TRANSITIONS[booking.status] ?? [];

                  return (
                    <TableRow
                      key={booking.id}
                      className={`hover:bg-zinc-50 transition-colors ${idx % 2 === 1 ? "bg-zinc-50/50" : ""}`}
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar name={booking.user?.name ?? "?"} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                              {booking.user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {booking.user?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.pill}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot} ${status.pulse ? "animate-pulse" : ""}`}
                          />
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                          <CalendarDays
                            size={13}
                            className="text-zinc-300 shrink-0"
                          />
                          {new Date(booking.createdAt).toLocaleDateString(
                            "en-BD",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {allowedNext.includes("CONFIRMED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleStatusChange(booking.id, "CONFIRMED")
                              }
                              className="h-7 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-none px-3"
                            >
                              Confirm
                            </Button>
                          )}
                          {allowedNext.includes("COMPLETED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleStatusChange(booking.id, "COMPLETED")
                              }
                              className="h-7 text-xs font-semibold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-none px-3"
                            >
                              Complete
                            </Button>
                          )}
                          {allowedNext.includes("CANCELLED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleStatusChange(booking.id, "CANCELLED")
                              }
                              className="h-7 w-7 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors p-0"
                            >
                              <Trash2 size={13} />
                            </Button>
                          )}
                          {allowedNext.length === 0 && (
                            <span className="text-xs text-zinc-300 font-medium">
                              —
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
