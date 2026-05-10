"use server";
import { PaginatedResponse, ServiceResponse } from "@/types/sharedTypes";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

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
    averageRating: number;
    category: {
      id: string;
      name: string;
    }
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  payment?: {
    id: string;
    status: string;
    amount: number;
    transactionId?: string;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

export interface CreateBookingPayload {
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingPayload {
  status: BookingStatus;
}

export interface BookingFilters {
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
      data: json?.data?.data ?? [],
      meta: json?.data?.meta ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getBookings]", message);
    return { data: null, meta: null, error: message };
  }
}

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