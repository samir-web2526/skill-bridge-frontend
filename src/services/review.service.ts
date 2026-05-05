"use server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  bookingId: string;
  tutorId: string;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  tutor?: {
    id: string;
    bio: string;
    hourlyRate: number;
  };
}

export interface CreateReviewPayload {
  bookingId: string;
  tutorId: string;
  rating: number;       // 1 - 5
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

// Consistent response wrapper
export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

// ─── Services ─────────────────────────────────────────────────────────────────

// POST /api/v1/reviews  (STUDENT only)
export async function createReview(
  payload: CreateReviewPayload
): Promise<ServiceResponse<Review>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to create review" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[createReview]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/reviews  (Public)
export async function getAllReviews(): Promise<ServiceResponse<Review[]>> {
  try {
    const result = await fetch(`${API}/api/v1/reviews`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch reviews" };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getAllReviews]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/reviews/my-given-reviews  (STUDENT only)
export async function getMyGivenReviews(): Promise<ServiceResponse<Review[]>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/reviews/my-given-reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch your reviews" };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getMyGivenReviews]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/reviews/my-received-reviews  (TUTOR only)
export async function getMyReceivedReviews(): Promise<ServiceResponse<Review[]>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/reviews/my-received-reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch received reviews" };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getMyReceivedReviews]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/reviews/tutor/:tutorId  (Public)
export async function getReviewsByTutorId(
  tutorId: string
): Promise<ServiceResponse<Review[]>> {
  try {
    const result = await fetch(`${API}/api/v1/reviews/tutor/${tutorId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch tutor reviews" };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getReviewsByTutorId]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/reviews/:id  (Public)
export async function getReviewById(
  reviewId: string
): Promise<ServiceResponse<Review>> {
  try {
    const result = await fetch(`${API}/api/v1/reviews/${reviewId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Review not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getReviewById]", message);
    return { data: null, error: message };
  }
}

// PATCH /api/v1/reviews/:id  (STUDENT only)
export async function updateReview(
  reviewId: string,
  payload: UpdateReviewPayload
): Promise<ServiceResponse<Review>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Update failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateReview]", message);
    return { data: null, error: message };
  }
}

// DELETE /api/v1/reviews/:id  (STUDENT, ADMIN)
export async function deleteReview(
  reviewId: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Delete failed" };
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[deleteReview]", message);
    return { data: null, error: message };
  }
}