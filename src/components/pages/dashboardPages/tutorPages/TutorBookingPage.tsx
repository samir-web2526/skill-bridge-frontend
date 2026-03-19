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
import { toast } from "sonner";
import {
  getTutorBookings,
  updateTutorBookingStatus,
} from "@/lib/auth/tutorActions/actions";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function TutorBookingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {paginations
            ? `${paginations.total} booking${paginations.total !== 1 ? "s" : ""} found`
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
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const allowedNext = ALLOWED_TRANSITIONS[booking.status] ?? [];
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <p className="font-medium text-sm">
                        {booking.user?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.user?.email ?? ""}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[booking.status] ?? "bg-zinc-100 text-zinc-600"}`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {allowedNext.length > 0 ? (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value)
                              handleStatusChange(booking.id, e.target.value);
                          }}
                          className="text-xs border rounded-md px-2 py-1 bg-white"
                        >
                          <option value="" disabled>
                            Change...
                          </option>
                          {allowedNext.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
    </div>
  );
}
