"use server";
import { PaginatedResponse, ServiceResponse } from "@/types/sharedTypes";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;

  _count?: {
    tutor: number;
  };

  tutor?: {
    id: string;
    bio: string;
    hourlyRate: number;

    _count?: {
      booking: number;
      review: number;
    };
  }[];

  totalBookings?: number;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

function buildQueryString(filters: CategoryFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<ServiceResponse<Category>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = result.status !== 204 ? await result.json() : null;

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to create category" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[createCategory]", message);
    return { data: null, error: message };
  }
}

export async function getCategories(
  filters: CategoryFilters = {}
): Promise<PaginatedResponse<Category[]>> {
  try {
    const qs = buildQueryString(filters);

    const result = await fetch(`${API}/api/v1/categories${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = result.status !== 204 ? await result.json() : null;

    if (!result.ok) {
      return {
        data: null,
        meta: null,
        error: json?.message ?? "Failed to fetch categories",
      };
    }

    return {
      data: json?.data?.data ?? [],
      meta: json?.data?.meta ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getCategories]", message);
    return { data: null, meta: null, error: message };
  }
}

export async function getCategoryById(
  categoryId: string
): Promise<ServiceResponse<Category>> {
  try {
    const result = await fetch(`${API}/api/v1/categories/${categoryId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = result.status !== 204 ? await result.json() : null;

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Category not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getCategoryById]", message);
    return { data: null, error: message };
  }
}

export async function updateCategory(
  categoryId: string,
  payload: UpdateCategoryPayload
): Promise<ServiceResponse<Category>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/categories/${categoryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = result.status !== 204 ? await result.json() : null;

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Update failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateCategory]", message);
    return { data: null, error: message };
  }
}

export async function deleteCategory(
  categoryId: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = result.status !== 204 ? await result.json() : null;

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Delete failed" };
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[deleteCategory]", message);
    return { data: null, error: message };
  }
}