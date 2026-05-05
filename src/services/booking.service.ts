"use server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

// ─── Types ────────────────────────────────────────────────────────────────────
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface Booking {
  id: string;
  userId: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  isDeleted: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  tutor: {
    id: string;
    bio: string;
    hourlyRate: number;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface CreateBookingPayload {
  tutorId: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
}

export interface UpdateBookingPayload {
  status: BookingStatus;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Consistent response wrapper — used for ALL service functions
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

function buildQueryString(filters: BookingFilters): string {
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

// POST /api/v1/bookings  (STUDENT only)
export async function createBooking(
  payload: CreateBookingPayload
): Promise<ServiceResponse<Booking>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Booking failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[createBooking]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/bookings  (STUDENT, TUTOR, ADMIN)
export async function getBookings(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<Booking[]>> {
  try {
    const accessToken = await getAccessToken();
    const qs = buildQueryString(filters);

    const result = await fetch(`${API}/api/v1/bookings${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, meta: null, error: json?.message ?? "Failed to fetch bookings" };
    }

    return {
  data: json?.data?.data ?? [],   // ← was json?.data
  meta: json?.data?.meta ?? null, // ← was json?.meta
  error: null,
};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getBookings]", message);
    return { data: null, meta: null, error: message };
  }
}

// GET /api/v1/bookings/:bookingId  (STUDENT, TUTOR, ADMIN)
export async function getBookingById(
  bookingId: string
): Promise<ServiceResponse<Booking>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Booking not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getBookingById]", message);
    return { data: null, error: message };
  }
}

// PATCH /api/v1/bookings/:bookingId/cancel  (STUDENT only)
export async function cancelBooking(
  bookingId: string
): Promise<ServiceResponse<Booking>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Cancel failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[cancelBooking]", message);
    return { data: null, error: message };
  }
}

// PATCH /api/v1/bookings/:bookingId/status  (TUTOR only)
export async function updateBookingStatus(
  bookingId: string,
  payload: UpdateBookingPayload
): Promise<ServiceResponse<Booking>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Status update failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateBookingStatus]", message);
    return { data: null, error: message };
  }
}