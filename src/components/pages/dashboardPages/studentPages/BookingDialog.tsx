/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type BookingError = {
  message: string;
  isEmailError?: boolean;
};

type Props = {
  open: boolean;
  mode: "create" | "cancel";
  tutors?: any[];
  selectedTutorId?: string;
  onTutorChange?: (id: string) => void;
  cancelTutorName?: string;
  isSubmitting: boolean;
  error?: BookingError | null;
  onClose: () => void;
  onSubmit: (data: { tutorId: string; date: string; startTime: string; endTime: string }) => void;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="10" rx="2" stroke="#059669" strokeWidth="1.3" />
      <path d="M5 2v3M11 2v3M2 8h12" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#ef4444" strokeWidth="1.3" />
      <path d="M8 5v3.5M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12">
      <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,9 2.5,11 3.5,7 1,4.5 4.5,4.5" fill="#d97706" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConfirmIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l2.5 2.5 5.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarnTriangle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <path d="M7 2L13 12H1L7 2z" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 6v2.5M7 10v.5" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
      <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#b45309" strokeWidth="1.2" />
      <path d="M1 4l6 4 6-4" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TutorAvatar({ name }: { name: string }) {
  const initials =
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  return (
    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center justify-center shrink-0">
      {initials}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// আজকের তারিখ YYYY-MM-DD format-এ
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BookingDialog({
  open,
  mode,
  tutors = [],
  selectedTutorId = "",
  onTutorChange,
  cancelTutorName = "",
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: Props) {
  const isCreate = mode === "create";
  const selectedTutor = tutors.find((t) => t.id === selectedTutorId);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [resentEmail, setResentEmail] = useState(false);

  // tutor-এর available time range
  const availableFrom = selectedTutor?.availableFrom ?? "06:00";
  const availableTo = selectedTutor?.availableTo ?? "23:00";

  const handleResendVerification = async () => {
    try {
      await fetch("/api/auth/resend-verification", { method: "POST" });
      setResentEmail(true);
    } catch {}
  };

  const handleClose = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocalError(null);
    onClose();
  };

  const handleSubmit = () => {
    setLocalError(null);

    if (!selectedTutorId) {
      setLocalError("Please select a tutor.");
      return;
    }
    if (!date) {
      setLocalError("Please select a date.");
      return;
    }
    if (!startTime) {
      setLocalError("Please select a start time.");
      return;
    }
    if (!endTime) {
      setLocalError("Please select an end time.");
      return;
    }
    if (startTime >= endTime) {
      setLocalError("End time must be after start time.");
      return;
    }

    onSubmit({ tutorId: selectedTutorId, date, startTime, endTime });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border border-zinc-100">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 shrink-0 ${
              isCreate ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            {isCreate ? <CalendarIcon /> : <AlertIcon />}
          </div>
          <DialogTitle className="text-base font-extrabold tracking-tight text-zinc-900">
            {isCreate ? "Book a tutor" : "Cancel booking"}
          </DialogTitle>
          <p className="text-sm text-zinc-400 mt-1 font-normal">
            {isCreate
              ? "Pick a tutor, choose your slot, and confirm."
              : "This action cannot be undone."}
          </p>
          <div className="h-px bg-zinc-100 mt-4" />
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {isCreate ? (
            <>
              {/* ── Tutor selection ── */}
              {selectedTutor && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <span className="text-[11px] font-bold tracking-widest text-emerald-600 uppercase">
                    Selected
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {selectedTutor.user?.name} · ৳{Number(selectedTutor.hourlyRate).toLocaleString()}/hr
                  </span>
                </div>
              )}

              <p className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                Available tutors
              </p>

              {tutors.length === 0 ? (
                <p className="text-sm text-zinc-400 py-4 text-center">
                  No available tutors at the moment.
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-0.5">
                  {tutors.map((t) => {
                    const isSelected = selectedTutorId === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          onTutorChange?.(t.id);
                          // tutor change হলে time reset করো
                          setStartTime("");
                          setEndTime("");
                          setLocalError(null);
                        }}
                        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                          isSelected
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <TutorAvatar name={t.user?.name ?? "?"} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">
                              {t.user?.name}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {t.category?.name ?? "General"} · ৳{Number(t.hourlyRate).toLocaleString()}/hr
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {t.averageRating && Number(t.averageRating) > 0 && (
                            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                              <StarIcon />
                              {Number(t.averageRating).toFixed(1)}
                            </span>
                          )}
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center">
                              <CheckIcon />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Date & Time selection ── */}
              {selectedTutor && (
                <div className="space-y-3 pt-1">
                  <div className="h-px bg-zinc-100" />
                  <p className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                    Session details
                  </p>

                  {/* Tutor availability info */}
                  <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-50 rounded-lg px-3 py-2">
                    <CalendarIcon />
                    <span>
                      Tutor available:{" "}
                      <span className="font-semibold text-zinc-600">
                        {availableFrom} – {availableTo}
                      </span>
                    </span>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={todayStr()}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* Start & End Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">
                        Start time <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        min={availableFrom}
                        max={availableTo}
                        onChange={(e) => {
                          setStartTime(e.target.value);
                          setLocalError(null);
                        }}
                        className="w-full h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">
                        End time <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        min={startTime || availableFrom}
                        max={availableTo}
                        onChange={(e) => {
                          setEndTime(e.target.value);
                          setLocalError(null);
                        }}
                        className="w-full h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Errors ── */}
              {(localError || error) && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  {error?.isEmailError ? <MailIcon /> : <WarnTriangle />}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {localError ??
                        (error?.isEmailError
                          ? "Your email isn't verified yet. Please verify to book a session."
                          : error?.message)}
                    </p>
                    {error?.isEmailError && (
                      <button
                        onClick={handleResendVerification}
                        disabled={resentEmail}
                        className="text-left text-[11px] font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors disabled:opacity-60 w-fit"
                      >
                        {resentEmail
                          ? "Email sent — check your inbox ✓"
                          : "Resend verification email →"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500 leading-relaxed">
                Are you sure you want to cancel your session with{" "}
                <span className="font-semibold text-zinc-800">{cancelTutorName}</span>? Your slot
                will be released.
              </p>
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <WarnTriangle />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Only <span className="font-semibold">Pending</span> bookings can be cancelled.
                  Confirmed sessions require tutor approval.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-t border-zinc-100">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl text-sm font-semibold"
          >
            {isCreate ? "Cancel" : "Keep it"}
          </Button>

          <Button
            onClick={isCreate ? handleSubmit : onSubmit as any}
            disabled={isSubmitting || (isCreate && !selectedTutorId)}
            className={`rounded-xl text-sm font-semibold px-5 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              isCreate
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-100"
                : "bg-red-500 hover:bg-red-400 text-white shadow-red-100"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                  <circle
                    cx="7" cy="7" r="5"
                    stroke="#fff" strokeWidth="1.5"
                    strokeDasharray="20" strokeDashoffset="10"
                    strokeLinecap="round"
                  />
                </svg>
                Saving…
              </>
            ) : isCreate ? (
              <>
                <ConfirmIcon />
                Confirm booking
              </>
            ) : (
              "Yes, cancel"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}