"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Inbox } from "lucide-react";
import { getStudents, StudentProfile } from "@/services/student.service";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const gradients = [
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-600",
  "from-fuchsia-400 to-purple-600",
  "from-lime-400 to-green-600",
  "from-cyan-400 to-sky-600",
];

function avatarGradient(name: string) {
  const idx =
    name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    gradients.length;
  return gradients[idx];
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status?.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide border ${isActive
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-muted text-muted-foreground border-border"
        }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground"
          }`}
      />
      {status ?? "Unknown"}
    </span>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
      <span className="opacity-60">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function StudentCard({ student }: { student: StudentProfile }) {
  const gradient = avatarGradient(student.user.name ?? "?");
  const initials = getInitials(student.user.name ?? "?");

  return (
    <div className="group relative bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="h-1 w-full bg-primary" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md`}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground text-base leading-tight truncate">
              {student.user.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {student.user.email}
            </p>
          </div>

          <StatusBadge status={student.user.status} />
        </div>

        {(student.class || student.group || student.address) && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
            {student.class && (
              <Chip
                label={`Class ${student.class}`}
                icon={
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                }
              />
            )}
            {student.group && (
              <Chip
                label={student.group}
                icon={
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />
            )}
            {student.address && (
              <Chip
                label={student.address}
                icon={
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="h-1 bg-primary/30 w-full" />
      <div className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted/60 rounded w-1/2" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>
    </div>
  );
}

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const res = await getStudents();
      if (res.error) {
        setError(res.error);
        setStudents([]);
      } else {
        setStudents(res.data || []);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        s.user.name?.toLowerCase().includes(q) ||
        s.user.email?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q)
      );
    });
  }, [students, search]);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="mb-20">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            My Students
          </h1>
          {!loading && !error && (
            <p className="text-sm text-muted-foreground mt-1">
              {students.length} student{students.length !== 1 ? "s" : ""} enrolled
            </p>
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl px-5 py-4 text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-14 h-14 mb-4 text-muted-foreground opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="font-semibold text-foreground text-base">No students yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Students who book sessions with you will appear here.
          </p>
        </div>
      )}

      {!loading && !error && students.length > 0 && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Inbox size={22} className="text-primary" />
              </div>
              <p className="font-semibold text-foreground text-base">No matching students</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}