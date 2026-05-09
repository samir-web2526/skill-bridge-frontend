/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Search, Trash2, RotateCcw, GraduationCap, Mail, BookOpen } from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  getTutors,
  getDeletedTutors,
  deleteTutor,
  restoreTutor,
  updateTutorStatus,
  TutorProfile,
  userStatus,
} from "@/services/tutors.service";

// ── Avatar initials ───────────────────────────────────────────────────────────
function getInitials(name: string = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-600",
  "from-fuchsia-400 to-purple-600",
  "from-cyan-400 to-sky-600",
];

function avatarGradient(name: string = "") {
  const idx = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[idx];
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: userStatus }) {
  const map: Record<userStatus, string> = {
    ACTIVE: "bg-primary/10 text-primary border-primary/20",
    PENDING: "bg-amber-500/10  text-amber-600  border-amber-500/20  dark:text-amber-400",
    BANNED: "bg-red-500/10    text-red-600    border-red-500/20    dark:text-red-400",
  };
  const dot: Record<userStatus, string> = {
    ACTIVE: "bg-primary",
    PENDING: "bg-amber-500",
    BANNED: "bg-red-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] ?? "bg-muted-foreground"}`} />
      {status}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="h-1 bg-primary/30 w-full" />
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted/60 rounded w-1/2" />
        </div>
        <div className="h-8 w-28 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

// ── Tutor Card ────────────────────────────────────────────────────────────────
function TutorCard({
  tutor,
  view,
  onDelete,
  onRestore,
  onStatus,
}: {
  tutor: any;
  view: "active" | "deleted";
  onDelete: (id: string, hasActive: boolean) => void;
  onRestore: (id: string) => void;
  onStatus: (id: string, status: userStatus) => void;
}) {
  const totalBookings = tutor.totalBookings ?? tutor._count?.booking ?? 0;
  const hasActiveBooking = totalBookings > 0;
  const gradient = avatarGradient(tutor.user?.name || "");
  const initials = getInitials(tutor.user?.name || "");

  return (
    <div className="group bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* accent bar */}
      <div className="h-1 w-full bg-primary" />

      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-foreground text-base leading-tight">
              {tutor.user?.name}
            </p>
            <StatusBadge status={tutor.user?.status} />
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {tutor.user?.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {tutor.user.email}
              </span>
            )}
            {tutor.category?.name && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {tutor.category.name}
              </span>
            )}
            {totalBookings > 0 && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {totalBookings} booking{totalBookings !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {hasActiveBooking && view === "active" && (
            <p className="text-[11px] text-primary font-medium">
              ⚠ Active booking — status change restricted
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {view === "active" && (
            <>
              <select
                value={tutor.user?.status}
                onChange={(e) => onStatus(tutor.id, e.target.value as userStatus)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING" disabled={hasActiveBooking}>Pending</option>
                <option value="BANNED" disabled={hasActiveBooking}>Banned</option>
              </select>

              <button
                onClick={() => onDelete(tutor.id, hasActiveBooking)}
                title="Delete tutor"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {view === "deleted" && (
            <button
              onClick={() => onRestore(tutor.id)}
              title="Restore tutor"
              className="flex items-center gap-2 h-9 px-4 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ManageTutorPage() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"active" | "deleted">("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    const res =
      view === "active"
        ? await getTutors({ searchTerm: searchTerm || undefined, page, limit, isDeleted: false })
        : await getDeletedTutors();

    if (res.error || !res.data) {
      toast.error(res.error || "No data found");
      setLoading(false);
      return;
    }

    setTutors(res.data || []);
    setTotal(res.meta?.total || (res.data ? res.data.length : 0));
    setLoading(false);
  }, [view, page, limit, searchTerm]);

  const filteredTutors = useMemo(() => {
    return tutors.filter((t: any) => {
      if (activeFilter === "All") return true;
      return t.user?.status === activeFilter;
    });
  }, [tutors, activeFilter]);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);

  const handleDelete = async (id: string, hasActiveBooking: boolean) => {
    if (hasActiveBooking) return toast.error("Cannot delete tutor with active booking");
    const res = await deleteTutor(id);
    if (res.error) return toast.error(res.error);
    toast.success("Tutor moved to deleted");
    fetchTutors();
  };

  const handleRestore = async (id: string) => {
    const res = await restoreTutor(id);
    if (res.error) return toast.error(res.error);
    toast.success("Tutor restored");
    fetchTutors();
  };

  const handleStatus = async (id: string, status: userStatus) => {
    const res = await updateTutorStatus(id, status);
    if (res.error) return toast.error(res.error);
    toast.success("Status updated");
    fetchTutors();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Manage Tutors
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total} tutor{total !== 1 ? "s" : ""} {view === "deleted" ? "deleted" : "found"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* View toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
          {(["active", "deleted"] as const).map((v) => (
            <button
              key={v}
              onClick={() => { setView(v); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${view === v
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {v === "active" ? "Active" : "Deleted"}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        {view === "active" && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors w-52"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["All", "ACTIVE", "PENDING", "BANNED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveFilter(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    activeFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <GraduationCap className="w-14 h-14 mb-4 text-muted-foreground opacity-20" />
          <p className="font-semibold text-foreground text-base">
            {searchTerm || activeFilter !== "All" ? "No matching tutors found" : "No tutors found"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTutors.map((tutor: any) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              view={view}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onStatus={handleStatus}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {view === "active" && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl"
          >
            ← Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}