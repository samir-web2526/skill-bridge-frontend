"use server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  description?: string;  // ← যোগ করো
  createdAt: string;
  _count?: {
    tutor: number;
  };
  tutor?: {
    id: string;
    bio: string;
    hourlyRate: number;
  }[];
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Consistent response wrapper
export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export type PaginatedResponse<T> =
  | { data: T; meta: PaginationMeta; error: null }
  | { data: null; meta: null; error: string };

// ─── Helper ───────────────────────────────────────────────────────────────────

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

// ─── Services ─────────────────────────────────────────────────────────────────

// POST /api/v1/categories  (ADMIN only)
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

    const json = await result.json();

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

// GET /api/v1/categories  (Public)
// export async function getCategories(
//   filters: CategoryFilters = {}
// ): Promise<PaginatedResponse<Category[]>> {
//   try {
//     const qs = buildQueryString(filters);

//     const result = await fetch(`${API}/api/v1/categories${qs}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       next: { revalidate: 60 },
//     });

//     const json = await result.json();

//     if (!result.ok) {
//       return { data: null, meta: null, error: json?.message ?? "Failed to fetch categories" };
//     }

//     return {
//       data: json?.data ?? [],
//       meta: json?.meta ?? null,
//       error: null,
//     };
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : "Something went wrong";
//     console.error("[getCategories]", message);
//     return { data: null, meta: null, error: message };
//   }
// }

export async function getCategories(
  filters: CategoryFilters = {}
): Promise<PaginatedResponse<Category[]>> {
  try {
    const qs = buildQueryString(filters);

    const result = await fetch(`${API}/api/v1/categories${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, meta: null, error: json?.message ?? "Failed to fetch categories" };
    }

    return {
      data: json?.data?.data ?? [],      // ← was json?.data
      meta: json?.data?.meta ?? null,    // ← was json?.meta
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getCategories]", message);
    return { data: null, meta: null, error: message };
  }
}

// GET /api/v1/categories/:categoryId  (Public)
export async function getCategoryById(
  categoryId: string
): Promise<ServiceResponse<Category>> {
  try {
    const result = await fetch(`${API}/api/v1/categories/${categoryId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();

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

// PATCH /api/v1/categories/:categoryId  (ADMIN only)
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

    const json = await result.json();

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

// DELETE /api/v1/categories/:categoryId  (ADMIN only)
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

    const json = await result.json();

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