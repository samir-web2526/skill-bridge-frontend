/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = process.env.NEXT_PUBLIC_API;

export type CreateBookingPayload = {
  tutorId: string;
  date: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.message || "Failed to create booking") as any;
    err.code =
      json.message?.toLowerCase().includes("verify") ||
      json.message?.toLowerCase().includes("email")
        ? "EMAIL_NOT_VERIFIED"
        : "BOOKING_FAILED";
    throw err;
  }

  return json;
}
