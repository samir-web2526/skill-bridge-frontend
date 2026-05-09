"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Loader2,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { getBookings } from "@/services/booking.service";
import { getMyReceivedReviews, Review } from "@/services/review.service";
import { getStudents, StudentProfile } from "@/services/student.service";

// ── Types ───────────────────────────────────────────────────────────────────

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  payment?: { status: string } | null;
  user?: { name: string; email: string };
  tutor?: {
    id: string;
    hourlyRate?: number | string;
    category?: { name: string };
    user?: { name: string; email: string };
  };
};

// ── Helper components ───────────────────────────────────────────────────────

function Avatar({
  name,
  variant = "primary",
  size = "md",
}: {
  name: string;
  variant?: "primary" | "zinc";
  size?: "sm" | "md";
}) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${dim} rounded-full font-extrabold flex items-center justify-center shrink-0 ${
        variant === "primary"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {initials}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  const r = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,9 2.5,11 3.5,7 1,4.5 4.5,4.5"
            fill={i < r ? "#f59e0b" : "var(--muted-foreground)"}
          />
        </svg>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex items-start gap-3">
      <div className={`p-2 rounded-xl ${accent} shrink-0`}>
        <Icon size={16} className="opacity-80" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
          {value}
        </p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
        >
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    bg: "bg-muted/50 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
    Icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
    Icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-primary text-primary-foreground border-primary",
    dot: "bg-primary-foreground",
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
    Icon: XCircle,
  },
} as const;

// ── Mini bar chart ───────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end justify-center" style={{ height: 60 }}>
            <div
              className="w-full rounded-t-sm bg-primary transition-all duration-700"
              style={{
                height: `${Math.max((d.value / max) * 60, d.value > 0 ? 4 : 0)}px`,
                opacity: d.value === 0 ? 0.2 : 1,
              }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Earnings sparkline ───────────────────────────────────────────────────────

function EarningsSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const w = 260;
  const h = 48;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4)}`)
    .join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full text-primary" preserveAspectRatio="none">
      <defs>
        <linearGradient id="earn-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#earn-grad)" />
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Status donut ─────────────────────────────────────────────────────────────

function StatusDonut({
  completed,
  confirmed,
  pending,
  cancelled,
}: {
  completed: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}) {
  const total = completed + confirmed + pending + cancelled || 1;
  const segments = [
    { value: completed, color: "var(--color-primary)", label: "Completed" },
    { value: confirmed, color: "var(--color-chart-1)", label: "Confirmed" },
    { value: pending, color: "var(--color-chart-2)", label: "Pending" },
    { value: cancelled, color: "var(--color-destructive)", label: "Cancelled" },
  ];
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={seg.value === 0 ? 0 : 1}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fontSize="14" fontWeight="800" fill="currentColor" className="text-foreground">{total}</text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-muted-foreground w-20">{seg.label}</span>
            <span className="text-xs font-bold text-foreground">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Rating distribution bar ───────────────────────────────────────────────────

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const color =
    star === 5 ? "bg-primary"
    : star === 4 ? "bg-primary/80"
    : star === 3 ? "bg-primary/60"
    : "bg-destructive/50";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-3 shrink-0">{star}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-muted-foreground w-4 text-right shrink-0">{count}</span>
    </div>
  );
}

// ── Main Tutor Dashboard ─────────────────────────────────────────────────────

export default function TutorDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      const [bookingRes, reviewRes, studentRes] = await Promise.all([
        getBookings({ limit: 100 }),
        getMyReceivedReviews(1),
        getStudents(),
      ]);

      if (bookingRes.error) {
        setError(bookingRes.error);
      } else {
        setBookings((bookingRes.data as unknown as Booking[]) ?? []);
      }

      if (reviewRes?.data) {
        setReviews(reviewRes.data.data ?? []);
      }
      if (studentRes?.data) {
        setStudents(studentRes.data ?? []);
      }

      setIsLoading(false);
    };
    load();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    // const totalStudents = students.length;

    const totalEarnings = bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((s, b) => s + Number(b.tutor?.hourlyRate ?? 0), 0);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    // Monthly bookings (last 6 months)
    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("en-BD", { month: "short" });
      const count = bookings.filter((b) => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
      }).length;
      return { label, value: count };
    });

    // Monthly earnings (last 6 months)
    const monthlyEarnings = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return bookings
        .filter((b) => {
          const bd = new Date(b.createdAt);
          return (
            bd.getFullYear() === d.getFullYear() &&
            bd.getMonth() === d.getMonth() &&
            b.status === "COMPLETED"
          );
        })
        .reduce((s, b) => s + Number(b.tutor?.hourlyRate ?? 0), 0);
    });

    // Rating breakdown
    const fiveStar = reviews.filter((r) => Math.round(r.rating) === 5).length;
    const fourStar = reviews.filter((r) => Math.round(r.rating) === 4).length;
    const threeStar = reviews.filter((r) => Math.round(r.rating) === 3).length;
    const twoStar = reviews.filter((r) => Math.round(r.rating) === 2).length;
    const oneStar = reviews.filter((r) => Math.round(r.rating) === 1).length;

    // Recent bookings (latest 5)
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Recent reviews (latest 4)
    const recentReviews = [...reviews]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

    // Unique students
    const uniqueStudents = new Set(
      bookings.map((b) => b.user?.email).filter(Boolean)
    ).size;

    return {
      total: bookings.length,
      completed,
      confirmed,
      pending,
      cancelled,
      totalEarnings,
      avgRating,
      monthlyData,
      monthlyEarnings,
      fiveStar,
      fourStar,
      threeStar,
      twoStar,
      oneStar,
      recentBookings,
      recentReviews,
      uniqueStudents,
      totalReviews: reviews.length,
      totalStudents: students.length,
    };
  }, [bookings, reviews, students]);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-12 space-y-6">

        {/* ── Page header ── */}
        <div>
          <p className="text-[11px] font-bold tracking-widest text-primary uppercase mb-1">
            My Teaching
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your teaching activity
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total bookings"
            value={stats.total}
            icon={BookOpen}
            accent="bg-muted text-muted-foreground"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            accent="bg-primary/10 text-primary"
            sub={
              stats.total > 0
                ? `${Math.round((stats.completed / stats.total) * 100)}% completion rate`
                : undefined
            }
          />
          <StatCard
            label="Total earnings"
            value={stats.totalEarnings > 0 ? `৳${stats.totalEarnings.toLocaleString()}` : "—"}
            icon={CreditCard}
            accent="bg-chart-1/10 text-chart-1"
          />
          <StatCard
            label="Avg rating"
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
            icon={Star}
            accent="bg-chart-2/10 text-chart-2"
            sub={`${stats.totalReviews} review${stats.totalReviews !== 1 ? "s" : ""} received`}
          />
          <StatCard
            label="My Students"
            value={stats.totalStudents}
            icon={Users}
            accent="bg-chart-3/10 text-chart-3"
            sub="Active learners"
          />
        </div>

        {/* ── Row: Donut + Monthly bookings bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader title="Booking status" />
            <StatusDonut
              completed={stats.completed}
              confirmed={stats.confirmed}
              pending={stats.pending}
              cancelled={stats.cancelled}
            />
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader title="Bookings — last 6 months" />
            {bookings.length === 0 ? (
              <p className="text-xs text-muted-foreground mt-4">No data yet</p>
            ) : (
              <MiniBarChart data={stats.monthlyData} />
            )}
          </div>
        </div>

        {/* ── Row: Earnings sparkline + Rating breakdown ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader title="Earnings trend — last 6 months" />
            {stats.totalEarnings === 0 ? (
              <p className="text-xs text-zinc-300 mt-4">No earnings data yet</p>
            ) : (
              <div className="mt-2">
                <p className="text-2xl font-extrabold text-primary tracking-tight">
                  ৳{stats.totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mb-3">total earned</p>
                <EarningsSparkline data={stats.monthlyEarnings} />
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader title="Rating breakdown" />
            {stats.totalReviews === 0 ? (
              <p className="text-xs text-zinc-300 mt-4">No reviews yet</p>
            ) : (
              <div className="space-y-3 mt-1">
                {/* Avg rating summary */}
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <p className="text-3xl font-extrabold text-foreground">
                    {stats.avgRating.toFixed(1)}
                  </p>
                  <div>
                    <StarRow rating={stats.avgRating} />
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      from {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {/* Bars */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const count =
                      s === 5 ? stats.fiveStar
                      : s === 4 ? stats.fourStar
                      : s === 3 ? stats.threeStar
                      : s === 2 ? stats.twoStar
                      : stats.oneStar;
                    return (
                      <RatingBar key={s} star={s} count={count} total={stats.totalReviews} />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Row: Recent bookings + Recent reviews ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Recent bookings */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader
              title="Recent bookings"
              action="View all"
              onAction={() => router.push("/dashboard/tutor/bookings")}
            />
            {stats.recentBookings.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2">
                <BookOpen size={22} className="text-muted" />
                <p className="text-xs text-muted-foreground">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.map((booking) => {
                  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
                  return (
                    <div key={booking.id} className="flex items-center gap-3 py-1">
                      <Avatar name={booking.user?.name ?? "?"} variant="primary" size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {booking.user?.name ?? "—"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CalendarDays size={10} className="text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(booking.createdAt).toLocaleDateString("en-BD", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent reviews */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader
              title="Recent reviews"
              action="View all"
              onAction={() => router.push("/dashboard/tutor/reviews")}
            />
            {stats.recentReviews.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2">
                <Star size={22} className="text-muted" />
                <p className="text-xs text-muted-foreground">No reviews yet</p>
                <p className="text-[11px] text-muted-foreground">
                  Complete sessions to start receiving reviews
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentReviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-3 py-1">
                    <Avatar name={review.user?.name ?? "?"} variant="zinc" size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {review.user?.name ?? "—"}
                        </p>
                        <StarRow rating={review.rating} />
                      </div>
                      {review.comment && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── My Students ── */}
<div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
  <SectionHeader title="My Students" />

  {students.length === 0 ? (
    <p className="text-xs text-muted-foreground">No students yet</p>
  ) : (
    <div className="space-y-3">
      {students.slice(0, 5).map((s) => (
        <div key={s.id} className="flex items-center gap-3">
          <Avatar name={s.user.name} variant="zinc" size="sm" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {s.user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {s.user.email}
            </p>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {s.user.status}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

        {/* ── Quick actions ── */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <SectionHeader title="Quick actions" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: "My bookings",
                icon: CalendarDays,
                path: "/dashboard/bookings",
                bg: "bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/20",
              },
              {
                label: "My reviews",
                icon: Star,
                path: "/dashboard/reviews",
                bg: "bg-chart-2/10 text-chart-2 border-chart-2/20 hover:bg-chart-2/20",
              },
              {
                label: "My students",
                icon: Users,
                path: "/dashboard/tutor/students",
                bg: "bg-chart-3/10 text-chart-3 border-chart-3/20 hover:bg-chart-3/20",
              },
            ].map(({ label, icon: Icon, bg, path }) => (
              <button
                key={label}
                onClick={() => router.push(path)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${bg}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}