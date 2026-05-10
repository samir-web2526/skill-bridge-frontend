/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { PaginatedResponse, ServiceResponse } from "@/types/sharedTypes";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

export type userStatus = "ACTIVE" | "BANNED" | "PENDING";

export interface Category {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  education: string;
  availability: boolean;
  availableFrom: string;
  availableTo: string;
  averageRating: number | null;
  totalBookings: number;
  totalReview: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  categoryId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    status: userStatus;
  };
  category: Category;
  review?: Review[];
}

export interface TutorStats {
  totalTutors: number;
  totalBookings: number;
  totalStudents: number;
  totalCategories: number;
}

export interface TutorFilters {
  searchTerm?: string;
  category?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableOnly?: boolean;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateTutorPayload {
  bio?: string;
  hourlyRate?: number;
  categoryId?: string;
  experience?: string;
  education?: string;
  availability?: boolean;
}


async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

function buildQueryString(filters: TutorFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getTutors(
  filters: TutorFilters = {}
): Promise<PaginatedResponse<TutorProfile[]>> {
  try {
    const qs = buildQueryString(filters);

    const result = await fetch(`${API}/api/v1/tutors${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, meta: null, error: json?.message ?? "Failed to fetch tutors" };
    }

    return {
      data: json?.data?.data ?? [],
      meta: json?.data?.meta ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getTutors]", message);
    return { data: null, meta: null, error: message };
  }
}

export async function getTutorStats(): Promise<ServiceResponse<TutorStats>> {
  try {
    const result = await fetch(`${API}/api/v1/tutors/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch stats" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getTutorStats]", message);
    return { data: null, error: message };
  }
}

export async function getMyTutorProfile(): Promise<ServiceResponse<TutorProfile>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/tutors/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Profile not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getMyTutorProfile]", message);
    return { data: null, error: message };
  }
}

export async function getDeletedTutors(): Promise<PaginatedResponse<TutorProfile[]>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/tutors/deleted`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, meta: null, error: json?.message ?? "Failed to fetch deleted tutors" };
    }

    return {
      data: json?.data ?? [],
      meta: {
        page: 1,
        limit: 10,
        total: json?.data?.length ?? 0,
        totalPage: 1,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, meta: null, error: "Something went wrong" };
  }
}

export async function getTutorById(
  tutorId: string
): Promise<ServiceResponse<TutorProfile>> {
  try {
    const result = await fetch(`${API}/api/v1/tutors/${tutorId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Tutor not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getTutorById]", message);
    return { data: null, error: message };
  }
}

export async function updateTutor(
  tutorId: string,
  payload: UpdateTutorPayload
): Promise<ServiceResponse<TutorProfile>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/tutors/${tutorId}`, {
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
    console.error("[updateTutor]", message);
    return { data: null, error: message };
  }
}

export async function updateTutorStatus(
  tutorId: string,
  status: userStatus
): Promise<ServiceResponse<TutorProfile>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/tutors/update-status/${tutorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Status update failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateTutorStatus]", message);
    return { data: null, error: message };
  }
}

export async function restoreTutor(
  tutorId: string
): Promise<ServiceResponse<TutorProfile>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/tutors/restore/${tutorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Restore failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[restoreTutor]", message);
    return { data: null, error: message };
  }
}

export async function deleteTutor(
  tutorId: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/tutors/${tutorId}`, {
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
    console.error("[deleteTutor]", message);
    return { data: null, error: message };
  }
}