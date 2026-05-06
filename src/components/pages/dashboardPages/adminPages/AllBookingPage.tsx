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
import { Booking, getBookings } from "@/services/booking.service";

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

const ALL_STATUSES = ["All", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
const [paginations, setPaginations] = useState<PaginationMeta | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { page, handlePageChange } = usePagination();

 useEffect(() => {
  const load = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getBookings({ page });

    if (result.error) {
      setError(result.error);
      setBookings([]);
      setPaginations(null);
    } else {
      setBookings(result.data ?? []);
      setPaginations(result.meta);
    }

    setIsLoading(false);
  };

  load();
}, [page]);

  const counts = useMemo(() => {
    return {
      total: bookings.length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
      confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = activeFilter === "All" || b.status === activeFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.tutor?.user?.name?.toLowerCase().includes(q) ||
        b.tutor?.user?.email?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, activeFilter, search]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Admin
        </p>
        <div className="flex items-end justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            All Bookings
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
            value={paginations?.total ?? counts.total}
            dotColor="bg-zinc-300"
            valueColor="text-zinc-800"
          />
          <StatCard
            label="Completed"
            value={counts.completed}
            dotColor="bg-emerald-500"
            valueColor="text-emerald-700"
          />
          <StatCard
            label="Confirmed"
            value={counts.confirmed}
            dotColor="bg-blue-400"
            valueColor="text-blue-700"
          />
          <StatCard
            label="Pending"
            value={counts.pending}
            dotColor="bg-amber-400"
            valueColor="text-amber-700"
          />
          <StatCard
            label="Cancelled"
            value={counts.cancelled}
            dotColor="bg-red-400"
            valueColor="text-red-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300"
            />
            <input
              type="text"
              placeholder="Search student or tutor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-300 outline-none focus:border-emerald-400 transition-colors w-52"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === s
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {s === "All" ? "All" : (STATUS_CONFIG[s]?.label ?? s)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                {["Student", "Tutor", "Status", "Date"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase py-3 first:pl-6"
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
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Inbox size={22} className="text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        No bookings found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((booking, idx) => {
                  const status = STATUS_CONFIG[booking.status] ?? {
                    pill: "bg-zinc-100 text-zinc-600 border-zinc-200",
                    dot: "bg-zinc-400",
                    label: booking.status,
                  };
                  return (
                    <TableRow
                      key={booking.id}
                      className={`hover:bg-zinc-50 transition-colors ${
                        idx % 2 === 1 ? "bg-zinc-50/50" : ""
                      }`}
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <InitialAvatar
                            name={booking.user?.name ?? "?"}
                            variant="emerald"
                          />
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
                        <div className="flex items-center gap-3">
                          <InitialAvatar
                            name={booking.tutor?.user?.name ?? "?"}
                            variant="zinc"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                              {booking.tutor?.user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {booking.tutor?.user?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.pill}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot} ${
                              status.pulse ? "animate-pulse" : ""
                            }`}
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
                            { day: "numeric", month: "short", year: "numeric" },
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
