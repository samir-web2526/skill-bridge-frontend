/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { ServiceResponse } from "@/types/sharedTypes";
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
  tutor?: {
  id: string;
  bio: string;
  hourlyRate: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};
}

export interface ReviewResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage:number
  };
  data: Review[];
}

export interface CreateReviewPayload {
  bookingId: string;
  tutorId: string;
  rating: number;      
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

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

export async function getAllReviews(
  page = 1,
  limit = 9
): Promise<ServiceResponse<ReviewResponse>> {
  try {
    const result = await fetch(
      `${API}/api/v1/reviews?page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message };
    }

    return {
      data: {
        meta: {
          page: json.data.meta.page,
          limit: json.data.meta.limit,
          total: json.data.meta.total,
          totalPage: json.data.meta.totalPage ?? 1,
        },
        data: json.data.data,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}
// GET /api/v1/reviews/my-given-reviews  (STUDENT only)
export async function getMyGivenReviews(
  page = 1
): Promise<ServiceResponse<ReviewResponse>> {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      `${API}/api/v1/reviews/my-given-reviews?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch reviews" };
    }

    return { data: json, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

// GET /api/v1/reviews/my-received-reviews  (TUTOR only)
export async function getMyReceivedReviews(
  page = 1
): Promise<ServiceResponse<ReviewResponse>> {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      `${API}/api/v1/reviews/my-received-reviews?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch reviews" };
    }

    return { data: json, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

// GET /api/v1/reviews/tutor/:tutorId  (Public)
export async function getReviewsByTutorId(
  tutorId: string,
  page = 1
): Promise<ServiceResponse<ReviewResponse>> {
  try {
    const res = await fetch(
      `${API}/api/v1/reviews/tutor/${tutorId}?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch reviews" };
    }

    return { data: json, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Something went wrong",
    };
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