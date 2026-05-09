
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
import { AlertCircle, CalendarDays, CheckCircle2, Inbox, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getBookings, updateBookingStatus } from "@/services/booking.service";

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

export default function TutorBookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [paginations, setPaginations] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { page, handlePageChange } = usePagination();

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
      }
      setIsLoading(false);
    };
    load();
  }, [page, search]);

  const stats = useMemo(
    () => ({
      total: paginations?.total ?? bookings.length,
      confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
    }),
    [bookings, paginations],
  );

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = activeFilter === "All" || b.status === activeFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, activeFilter, search]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const result = await updateBookingStatus(bookingId, { status: newStatus as any });
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Status updated!");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          Tutor Dashboard
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Bookings
          </h1>
          {paginations && (
            <p className="text-sm text-muted-foreground font-medium mb-0.5">
              {paginations.total} booking
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
              placeholder="Search by student…"
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
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {s === "All" ? "All" : (STATUS_CONFIG[s]?.label ?? s)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {["Student", "Status", "Date", "Payment", "Update Status"].map((h, i) => (
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
                    <TableCell className="py-4">
                      <div className="h-5 w-16 rounded-full bg-zinc-100" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <div className="h-7 w-20 rounded-lg bg-muted" />
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
                        {search || activeFilter !== "All" ? "No matching bookings found" : "No bookings yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((booking, idx) => {
                  const statusCfg = STATUS_CONFIG[booking.status] ?? {
                    pill: "bg-zinc-100 text-zinc-600 border-border",
                    dot: "bg-zinc-400",
                    label: booking.status,
                  };
                  const allowedNext = ALLOWED_TRANSITIONS[booking.status] ?? [];
                  const isPaid = booking.payment?.status === "PAID" || booking.status === "CONFIRMED";

                  return (
                    <TableRow
                      key={booking.id}
                      className={`hover:bg-muted/30 transition-colors ${idx % 2 === 1 ? "bg-muted/5" : ""}`}
                    >
                      {/* Student */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar name={booking.user?.name ?? "?"} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {booking.user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {booking.user?.email ?? ""}
                            </p>
                          </div>
                        </div>
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
                          <CalendarDays size={13} className="text-muted-foreground/30 shrink-0" />
                          {new Date(booking.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>

                      {/* Payment */}
                      <TableCell className="py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-chart-1/20 bg-chart-1/10 text-chart-1">
                            <CheckCircle2 size={11} className="text-chart-1" />
                            Paid
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300 font-medium">—</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {allowedNext.includes("CONFIRMED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                              className="h-7 text-xs font-semibold rounded-lg border border-chart-1/20 bg-chart-1/10 text-chart-1 hover:bg-chart-1/20 shadow-none px-3"
                            >
                              Confirm
                            </Button>
                          )}
                          {allowedNext.includes("COMPLETED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                              className="h-7 text-xs font-semibold rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 shadow-none px-3"
                            >
                              Complete
                            </Button>
                          )}
                          {allowedNext.includes("CANCELLED") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                              className="h-7 w-7 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors p-0"
                            >
                              <Trash2 size={13} />
                            </Button>
                          )}
                          {allowedNext.length === 0 && (
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
    </div>
  );
}