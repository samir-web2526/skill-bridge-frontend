/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PaginationMeta } from "@/components/ui/Pagination";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API;
const ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

export type BookingsResult = {
  data: any[];
  paginations: PaginationMeta;
};

export async function getAllBookings(
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
  } catch (err: any) {
    console.error("[getAllBookings]", err.message);
    return null;
  }
}

export type ReviewsResult = {
  data: any[];
  paginations: PaginationMeta;
};

export async function getAllReviews(
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
    console.error("[getAllReviews]", err.message);
    return null;
  }
}

export async function deleteReview(reviewId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });
    if (!res.ok) throw new Error("Failed to delete review");
    return { success: true };
  } catch (err: any) {
    console.error("[deleteReview]", err.message);
    return { error: err.message || "Something went wrong" };
  }
}

export type CategoriesResult = {
  data: any[];
  paginations: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

export async function getAllCategories(
  page: number,
  limit = 5,
): Promise<CategoriesResult | null> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${BASE_URL}/api/categories?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[getAllCategories]", err.message);
    return null;
  }
}

export async function createCategory(name: string, description: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) throw new Error("Failed to create category");

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[createCategory]", err.message);
    return null;
  }
}

export async function updateCategory(
  categoryId: string,
  name: string,
  description: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) throw new Error("Failed to update category");
    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[updateCategory]", err.message);
    return { error: err.message || "Something went wrong" };
  }
}

export async function deleteCategory(categoryId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Cookie: `better-auth.session_token=${token.value}`,
        Origin: ORIGIN,
      },
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return { success: true };
  } catch (err: any) {
    console.error("[deleteCategory]", err.message);
    return { error: err.message || "Something went wrong" };
  }
}
