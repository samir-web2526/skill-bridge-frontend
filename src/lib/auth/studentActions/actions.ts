/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PaginationMeta } from "@/components/ui/Pagination";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API;
const ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

export type TutorsResult = {
  data: any[];
  paginations: PaginationMeta;
};

export async function getAvailableTutors(
  page: number,
  limit = 5,
): Promise<TutorsResult | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return null;

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("availableOnly", "true");

    const res = await fetch(`${BASE_URL}/api/tutors?${params.toString()}`, {
      cache: "no-store",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tutors");
    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[getAvailableTutors]", err.message);
    return null;
  }
}

export type BookingsResult = {
  data: any[];
  paginations: PaginationMeta;
};

export async function getMyBookings(
  page: number,
  limit = 5,
): Promise<BookingsResult | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return null;

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${BASE_URL}/api/bookings?${params.toString()}`, {
      cache: "no-store",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");
    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[getMyBookings]", err.message);
    return null;
  }
}

export type CreateBookingPayload = {
  tutorId: string;
  date: string;
};

export async function createBooking(payload: CreateBookingPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to create booking" };
    return json;
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function cancelBooking(bookingId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to cancel booking" };
    return { success: true };
  } catch (err: any) {
    console.error("[cancelBooking]", err.message);
    return { error: err.message };
  }
}

export type ReviewsResult = {
  data: any[];
  paginations: PaginationMeta;
};

export async function getMyReviews(
  page: number,
  limit = 10,
): Promise<ReviewsResult | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return null;

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${BASE_URL}/api/reviews?${params.toString()}`, {
      cache: "no-store",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch reviews");
    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[getMyReviews]", err.message);
    return null;
  }
}

export async function createReview(payload: {
  bookingId: string;
  tutorId: string;
  rating: number;
  comment: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to create review" };
    return json.data;
  } catch (err: any) {
    console.error("[createReview]", err.message);
    return { error: err.message };
  }
}

export async function updateReview(
  reviewId: string,
  payload: { rating?: number; comment?: string },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `better-auth.session_token=${token.value}`,
      Origin: ORIGIN,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) return { error: json.message || "Failed to update review" };
  return json.data;
}

export async function deleteReview(reviewId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Cookie: `better-auth.session_token=${token.value}`,
      Origin: ORIGIN,
    },
  });

  if (!res.ok) return { error: "Failed to delete review" };
  return { success: true };
}
