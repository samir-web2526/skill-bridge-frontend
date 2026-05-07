/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// export type BookingError = {
//   message: string;
//   isEmailError?: boolean;
// };

// type Props = {
//   open: boolean;
//   mode: "create" | "cancel";
//   tutors?: any[];
//   selectedTutorId?: string;
//   onTutorChange?: (id: string) => void;
//   cancelTutorName?: string;
//   isSubmitting: boolean;
//   error?: BookingError | null;
//   onClose: () => void;
//   onSubmit: (data?: {
//     tutorId: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//   }) => void;
//   // ✅ existing active booking dates for this student
//   existingBookingDates?: string[]; // ["2025-06-01", "2025-06-05"]
// };

// function todayStr() {
//   return new Date().toISOString().split("T")[0];
// }

// // ✅ "06:00" format check helper
// function timeToMinutes(t: string) {
//   const [h, m] = t.split(":").map(Number);
//   return h * 60 + m;
// }

// export function BookingDialog({
//   open,
//   mode,
//   tutors = [],
//   selectedTutorId = "",
//   onTutorChange,
//   cancelTutorName,
//   isSubmitting,
//   error,
//   onClose,
//   onSubmit,
//   existingBookingDates = [],
// }: Props) {
//   const isCreate = mode === "create";
//   const selectedTutor = tutors.find((t) => t.id === selectedTutorId);

//   const [date, setDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [localError, setLocalError] = useState<string | null>(null);

//   const availableFrom = selectedTutor?.availableFrom ?? "06:00";
//   const availableTo = selectedTutor?.availableTo ?? "23:00";

//   const handleClose = () => {
//     setDate("");
//     setStartTime("");
//     setEndTime("");
//     setLocalError(null);
//     onClose();
//   };

//   // ✅ Date change handler - same date booking block
//   const handleDateChange = (val: string) => {
//     setStartTime("");
//     setEndTime("");
//     setLocalError(null);

//     if (existingBookingDates.includes(val)) {
//       setLocalError(
//         "You already have a booking on this date. Please complete or cancel it first."
//       );
//       setDate(val);
//       return;
//     }

//     setDate(val);
//   };

//   // ✅ Start time change handler
//   const handleStartTimeChange = (val: string) => {
//     setLocalError(null);
//     setEndTime(""); // reset end time when start changes

//     const fromMin = timeToMinutes(availableFrom);
//     const toMin = timeToMinutes(availableTo);
//     const selectedMin = timeToMinutes(val);

//     if (selectedMin < fromMin || selectedMin >= toMin) {
//       setLocalError(`Start time must be within ${availableFrom} - ${availableTo}`);
//     }

//     setStartTime(val);
//   };

//   // ✅ End time change handler
//   const handleEndTimeChange = (val: string) => {
//     setLocalError(null);

//     const toMin = timeToMinutes(availableTo);
//     const startMin = timeToMinutes(startTime);
//     const selectedMin = timeToMinutes(val);

//     if (selectedMin <= startMin) {
//       setLocalError("End time must be after start time.");
//     } else if (selectedMin > toMin) {
//       setLocalError(`End time must be within tutor working hours (before ${availableTo})`);
//     }

//     setEndTime(val);
//   };

//   const handleSubmit = () => {
//     if (!isCreate) {
//       onSubmit();
//       return;
//     }

//     setLocalError(null);

//     // ✅ Final validation before submit
//     if (!selectedTutorId) return setLocalError("Please select a tutor.");
//     if (!date) return setLocalError("Please select a date.");
//     if (!startTime || !endTime) return setLocalError("Please select time.");

//     // same date check
//     if (existingBookingDates.includes(date)) {
//       return setLocalError(
//         "You already have a booking on this date. Please complete or cancel it first."
//       );
//     }

//     const startMin = timeToMinutes(startTime);
//     const endMin = timeToMinutes(endTime);
//     const fromMin = timeToMinutes(availableFrom);
//     const toMin = timeToMinutes(availableTo);

//     if (startMin >= endMin) {
//       return setLocalError("End time must be after start time.");
//     }

//     if (startMin < fromMin || endMin > toMin) {
//       return setLocalError(
//         `Time must be within tutor working hours: ${availableFrom} - ${availableTo}`
//       );
//     }

//     // ✅ 6 AM - 11 PM global check (backend rule mirror)
//     if (startMin < timeToMinutes("06:00") || endMin > timeToMinutes("23:00")) {
//       return setLocalError("Booking allowed between 6 AM - 11 PM only.");
//     }

//     onSubmit({ tutorId: selectedTutorId, date, startTime, endTime });
//   };

//   const isDateAlreadyBooked = date && existingBookingDates.includes(date);

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border">
//         <DialogHeader className="px-6 pt-6 pb-0">
//           <DialogTitle className="text-base font-bold">
//             {isCreate ? "Book a tutor" : "Cancel booking"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="px-6 py-5 space-y-4">
//           {/* Cancel confirmation */}
//           {!isCreate && (
//             <p className="text-sm text-zinc-600">
//               Are you sure you want to cancel your booking with{" "}
//               <span className="font-semibold text-zinc-800">{cancelTutorName}</span>?
//               This action cannot be undone.
//             </p>
//           )}

//           {/* Tutor list */}
//           {isCreate && (
//             <div className="space-y-2 max-h-48 overflow-y-auto">
//               {tutors.map((t) => (
//                 <div
//                   key={t.id}
//                   onClick={() => {
//                     onTutorChange?.(t.id);
//                     setStartTime("");
//                     setEndTime("");
//                     setDate("");
//                     setLocalError(null);
//                   }}
//                   className={`p-2 border rounded cursor-pointer transition-colors ${
//                     selectedTutorId === t.id
//                       ? "bg-emerald-50 border-emerald-400"
//                       : "hover:bg-zinc-50"
//                   }`}
//                 >
//                   {t.user?.name}
//                   {/* ✅ Show tutor working hours */}
//                   {selectedTutorId === t.id && (
//                     <span className="ml-2 text-xs text-zinc-400">
//                       ({t.availableFrom} - {t.availableTo})
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Date */}
//           {isCreate && selectedTutor && (
//             <div className="space-y-1">
//               <label className="text-xs text-zinc-500">Select Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 min={todayStr()}
//                 onChange={(e) => handleDateChange(e.target.value)}
//                 className={`border p-2 w-full rounded ${
//                   isDateAlreadyBooked ? "border-red-400 bg-red-50" : ""
//                 }`}
//               />
//               {/* ✅ Inline date warning */}
//               {isDateAlreadyBooked && (
//                 <p className="text-xs text-red-500">
//                   You already have a booking on this date.
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Time — only show if date is valid */}
//           {isCreate && selectedTutor && date && !isDateAlreadyBooked && (
//             <div className="space-y-1">
//               <label className="text-xs text-zinc-500">
//                 Select Time ({availableFrom} - {availableTo})
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="time"
//                   value={startTime}
//                   min={availableFrom}
//                   max={availableTo}
//                   onChange={(e) => handleStartTimeChange(e.target.value)}
//                   className="border p-2 w-full rounded"
//                 />
//                 <input
//                   type="time"
//                   value={endTime}
//                   min={startTime || availableFrom}
//                   max={availableTo}
//                   onChange={(e) => handleEndTimeChange(e.target.value)}
//                   className="border p-2 w-full rounded"
//                   disabled={!startTime} // ✅ end time disable if no start
//                 />
//               </div>
//             </div>
//           )}

//           {/* Error */}
//           {(localError || error) && (
//             <p className="text-red-500 text-sm">
//               {localError || error?.message}
//             </p>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-2 p-4 border-t">
//           <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
//             Close
//           </Button>
//           <Button
//             disabled={
//               isSubmitting ||
//               (isCreate && (!selectedTutorId || !!isDateAlreadyBooked))
//             }
//             onClick={handleSubmit}
//             className={!isCreate ? "bg-red-600 hover:bg-red-500 text-white" : ""}
//           >
//             {isSubmitting
//               ? "Please wait..."
//               : isCreate
//               ? "Confirm Booking"
//               : "Yes, Cancel"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
  onSubmit: (data?: {
    tutorId: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  existingBookingDates?: string[];
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function BookingDialog({
  open,
  mode,
  tutors = [],
  selectedTutorId = "",
  onTutorChange,
  cancelTutorName,
  isSubmitting,
  error,
  onClose,
  onSubmit,
  existingBookingDates = [],
}: Props) {
  const isCreate = mode === "create";
  const selectedTutor = tutors.find((t) => t.id === selectedTutorId);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const availableFrom = selectedTutor?.availableFrom ?? "06:00";
  const availableTo = selectedTutor?.availableTo ?? "23:00";

  const handleClose = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocalError(null);
    onClose();
  };

  const handleDateChange = (val: string) => {
    setStartTime("");
    setEndTime("");
    setLocalError(null);

    if (existingBookingDates.includes(val)) {
      setLocalError(
        "You already have a booking on this date. Please complete or cancel it first."
      );
    }

    setDate(val);
  };

  const handleStartTimeChange = (val: string) => {
    setLocalError(null);
    setEndTime("");

    const fromMin = timeToMinutes(availableFrom);
    const toMin = timeToMinutes(availableTo);
    const selectedMin = timeToMinutes(val);

    if (selectedMin < fromMin || selectedMin >= toMin) {
      setLocalError(`Start time must be within ${availableFrom} - ${availableTo}`);
    }

    setStartTime(val);
  };

  const handleEndTimeChange = (val: string) => {
    setLocalError(null);

    const toMin = timeToMinutes(availableTo);
    const startMin = timeToMinutes(startTime);
    const selectedMin = timeToMinutes(val);

    if (selectedMin <= startMin) {
      setLocalError("End time must be after start time.");
    } else if (selectedMin > toMin) {
      setLocalError(`End time must be before ${availableTo}`);
    }

    setEndTime(val);
  };

  const handleSubmit = () => {
    if (!isCreate) {
      onSubmit();
      return;
    }

    setLocalError(null);

    if (!selectedTutorId) return setLocalError("Please select a tutor.");
    if (!date) return setLocalError("Please select a date.");
    if (!startTime || !endTime) return setLocalError("Please select time.");

    if (existingBookingDates.includes(date)) {
      return setLocalError(
        "You already have a booking on this date. Please complete or cancel it first."
      );
    }

    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    const fromMin = timeToMinutes(availableFrom);
    const toMin = timeToMinutes(availableTo);

    if (startMin >= endMin) {
      return setLocalError("End time must be after start time.");
    }

    if (startMin < fromMin || endMin > toMin) {
      return setLocalError(
        `Time must be within tutor working hours: ${availableFrom} - ${availableTo}`
      );
    }

    if (startMin < timeToMinutes("06:00") || endMin > timeToMinutes("23:00")) {
      return setLocalError("Booking allowed between 6 AM - 11 PM only.");
    }

    onSubmit({ tutorId: selectedTutorId, date, startTime, endTime });
  };

  const isDateAlreadyBooked = !!date && existingBookingDates.includes(date);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-base font-bold">
            {isCreate ? "Book a tutor" : "Cancel booking"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Cancel confirmation */}
          {!isCreate && (
            <p className="text-sm text-zinc-600">
              Are you sure you want to cancel your booking with{" "}
              <span className="font-semibold text-zinc-800">{cancelTutorName}</span>?
              This action cannot be undone.
            </p>
          )}

          {/* Tutor list */}
          {isCreate && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tutors.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onTutorChange?.(t.id);
                    setStartTime("");
                    setEndTime("");
                    setDate("");
                    setLocalError(null);
                  }}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedTutorId === t.id
                      ? "bg-emerald-50 border-emerald-400"
                      : "hover:bg-zinc-50"
                  }`}
                >
                  <span>{t.user?.name}</span>
                  {selectedTutorId === t.id && (
                    <span className="ml-2 text-xs text-zinc-400">
                      ({t.availableFrom} - {t.availableTo})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Date */}
          {isCreate && selectedTutor && (
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Select Date</label>
              <input
                type="date"
                value={date}
                min={todayStr()}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`border p-2 w-full rounded ${
                  isDateAlreadyBooked ? "border-red-400 bg-red-50" : ""
                }`}
              />
              {isDateAlreadyBooked && (
                <p className="text-xs text-red-500">
                  You already have a booking on this date.
                </p>
              )}
            </div>
          )}

          {/* Time — শুধু valid date থাকলে দেখাবে */}
          {isCreate && selectedTutor && date && !isDateAlreadyBooked && (
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">
                Select Time ({availableFrom} - {availableTo})
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={startTime}
                  min={availableFrom}
                  max={availableTo}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="border p-2 w-full rounded"
                />
                <input
                  type="time"
                  value={endTime}
                  min={startTime || availableFrom}
                  max={availableTo}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="border p-2 w-full rounded"
                  disabled={!startTime}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {(localError || error) && (
            <p className="text-red-500 text-sm">
              {localError || error?.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Close
          </Button>
          <Button
            disabled={
              isSubmitting ||
              (isCreate && (!selectedTutorId || isDateAlreadyBooked))
            }
            onClick={handleSubmit}
            className={!isCreate ? "bg-red-600 hover:bg-red-500 text-white" : ""}
          >
            {isSubmitting
              ? "Please wait..."
              : isCreate
              ? "Confirm Booking"
              : "Yes, Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}