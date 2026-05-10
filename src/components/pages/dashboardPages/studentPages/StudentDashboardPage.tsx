/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  Star,
  CreditCard,
  TrendingUp,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getBookings } from "@/services/booking.service";
import { getMyGivenReviews, Review } from "@/services/review.service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  date: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  payment?: { status: string } | null;
  review?: any;
  tutor?: {
    id: string;
    hourlyRate?: number | string;
    category?: { name: string };
    user?: { name: string; email: string };
  };
};

function TutorAvatar({
  name,
  size = "md",
}: {
  name: string;
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
      className={`${dim} rounded-full bg-primary/10 text-primary font-extrabold flex items-center justify-center shrink-0`}
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

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    dot: "bg-amber-400",
    pulse: true,
    Icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    dot: "bg-blue-400",
    pulse: false,
    Icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
    pulse: false,
    Icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
    dot: "bg-red-400",
    pulse: false,
    Icon: XCircle,
  },
} as const;

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


function SpendingSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const w = 260;
  const h = 48;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4)}`)
    .join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#spark-grad)" />
      <polyline
        points={pts}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    { value: completed, color: "var(--primary)", label: "Completed" },
    { value: confirmed, color: "#3b82f6", label: "Confirmed" },
    { value: pending, color: "#f59e0b", label: "Pending" },
    { value: cancelled, color: "#ef4444", label: "Cancelled" },
  ];

  const r = 36;
  const cx = 44;
  const cy = 44;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="10" />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={seg.value === 0 ? 0 : 1}
            />
          );
          offset += dash;
          return el;
        })}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="800"
          fill="currentColor"
          className="text-foreground"
        >
          {total}
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: seg.color }}
            />
            <span className="text-xs text-muted-foreground w-20">{seg.label}</span>
            <span className="text-xs font-bold text-foreground">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const [bookingRes, reviewRes] = await Promise.all([
        getBookings({ limit: 100 }),
        getMyGivenReviews(1),
      ]);

      if (bookingRes.error) {
        setError(bookingRes.error);
      } else {
        setBookings((bookingRes.data as unknown as Booking[]) ?? []);
      }

      if (reviewRes?.data) {
        setReviews(reviewRes.data?.data ?? []);
      }

      setIsLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

    const totalSpend = bookings
      .filter((b) => b.payment?.status === "PAID" || b.status === "COMPLETED")
      .reduce((s, b) => s + Number(b.tutor?.hourlyRate ?? 0), 0);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("en-BD", { month: "short" });
      const count = bookings.filter((b) => {
        const bd = new Date(b.date ?? b.createdAt);
        return (
          bd.getFullYear() === d.getFullYear() &&
          bd.getMonth() === d.getMonth()
        );
      }).length;
      return { label, value: count };
    });

    const monthlySpend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return bookings
        .filter((b) => {
          const bd = new Date(b.date ?? b.createdAt);
          return (
            bd.getFullYear() === d.getFullYear() &&
            bd.getMonth() === d.getMonth() &&
            (b.payment?.status === "PAID" || b.status === "COMPLETED")
          );
        })
        .reduce((s, b) => s + Number(b.tutor?.hourlyRate ?? 0), 0);
    });

    const catMap: Record<string, number> = {};
    bookings.forEach((b) => {
      const cat = b.tutor?.category?.name ?? "Other";
      catMap[cat] = (catMap[cat] ?? 0) + 1;
    });
    const categories = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const recent = [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      total: bookings.length,
      completed,
      confirmed,
      pending,
      cancelled,
      totalSpend,
      avgRating,
      monthlyData,
      monthlySpend,
      categories,
      recent,
    };
  }, [bookings, reviews]);

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
        <div>
          <p className="text-[11px] font-bold tracking-widest text-primary uppercase mb-1">
            My Learning
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your learning activity
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

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
            sub={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completion rate` : undefined}
          />
          <StatCard
            label="Total spent"
            value={stats.totalSpend > 0 ? `৳${stats.totalSpend.toLocaleString()}` : "—"}
            icon={CreditCard}
            accent="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            label="Avg rating given"
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
            icon={Star}
            accent="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
            sub={`${reviews.length} review${reviews.length !== 1 ? "s" : ""} given`}
          />
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader title="Spending trend — last 6 months" />
            {stats.totalSpend === 0 ? (
              <p className="text-xs text-zinc-300 mt-4">No payment data yet</p>
            ) : (
              <div className="mt-2">
                <p className="text-2xl font-extrabold text-primary tracking-tight">
                  ৳{stats.totalSpend.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mb-3">total spent</p>
                <SpendingSparkline data={stats.monthlySpend} />
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader title="Sessions by subject" />
            {stats.categories.length === 0 ? (
              <p className="text-xs text-zinc-300 mt-4">No bookings yet</p>
            ) : (
              <div className="space-y-2.5 mt-1">
                {stats.categories.map(([cat, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground/80">{cat}</span>
                        <span className="text-muted-foreground">{count} session{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader onAction={() => router.push("/dashboard/bookings")} title="Recent bookings" action="View all" />
            {stats.recent.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2">
                <BookOpen size={22} className="text-muted" />
                <p className="text-xs text-muted-foreground">No bookings yet</p>
                <Button
                  size="sm"
                  onClick={() => router.push("/dashboard/tutors")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs mt-1"
                >
                  Book a tutor
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recent.map((booking) => {
                  const cfg =
                    STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 py-1"
                    >
                      <TutorAvatar
                        name={booking.tutor?.user?.name ?? "?"}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {booking.tutor?.user?.name ?? "—"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CalendarDays size={10} className="text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(
                              booking.date ?? booking.createdAt
                            ).toLocaleDateString("en-BD", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          {booking.tutor?.category?.name && (
                            <>
                              <span className="text-muted">·</span>
                              <span className="text-[11px] text-muted-foreground">
                                {booking.tutor.category.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <SectionHeader onAction={() => router.push("/dashboard/reviews")} title="My reviews" action="View all" />
            {reviews.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2">
                <Star size={22} className="text-muted" />
                <p className="text-xs text-muted-foreground">No reviews yet</p>
                <p className="text-[11px] text-muted-foreground">
                  Complete a session to leave a review
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.avgRating > 0 && (
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <p className="text-3xl font-extrabold text-amber-500">
                      {stats.avgRating.toFixed(1)}
                    </p>
                    <div>
                      <StarRow rating={stats.avgRating} />
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        avg across {reviews.length} review
                        {reviews.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )}
                {reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="flex items-start gap-3 py-1">
                    <TutorAvatar
                      name={review.tutor?.user?.name ?? "?"}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {review.tutor?.user?.name ?? "—"}
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

        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <SectionHeader title="Quick actions" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Find tutors",
                icon: TrendingUp,
                path: "/dashboard/tutors",
                bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/60",
              },
              {
                label: "My bookings",
                icon: CalendarDays,
                path: "/dashboard/bookings",
                bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/60",
              },
              {
                label: "My reviews",
                icon: Star,
                path: "/dashboard/reviews",
                bg: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900 hover:bg-purple-100 dark:hover:bg-purple-900/60",
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