"use server";

import { PaginationMeta } from "@/components/ui/Pagination";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API;
const ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

export type BookingsResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  paginations: PaginationMeta;
};

export async function getTutorBookings(
  page: number,
  limit = 10,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[getTutorBookings]", err.message);
    return null;
  }
}

export async function updateTutorBookingStatus(
  bookingId: string,
  status: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to update booking" };
    return { data: json.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[updateTutorBookingStatus]", err.message);
    return { error: err.message };
  }
}

export type ReviewsResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  paginations: PaginationMeta;
};

export async function getTutorReviews(
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

    const res = await fetch(
      `${BASE_URL}/api/reviews/my-reviews?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          Cookie: `better-auth.session_token=${token.value}`,
          Origin: ORIGIN,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch reviews");
    const json = await res.json();
    return json.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[getTutorReviews]", err.message);
    return null;
  }
}

export async function createTutorProfile(formData: {
  bio: string;
  hourlyRate: number;
  experience: number;
  categoryId: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/tutors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify(formData),
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Failed to create profile" };
    return { data: json.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[createTutorProfile]", err.message);
    return { error: err.message };
  }
}

export async function getTutorProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/tutors/profile`, {
      cache: "no-store",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });
    
    if (!res.ok) {
      if (res.status === 403) return null;
      throw new Error("Failed to fetch tutor profile");
    }
    const json = await res.json();
    return json.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[getTutorProfile]", err.message);
    return null;
  }
}
