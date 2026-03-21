/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = process.env.NEXT_PUBLIC_API;

export type CreateBookingPayload = {
  tutorId: string;
  date: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Failed to create booking");
    }

    return json;
  } catch (err: any) {
    console.error("[createBooking]", err.message);
    return { error: err.message || "Something went wrong" };
  }
}
