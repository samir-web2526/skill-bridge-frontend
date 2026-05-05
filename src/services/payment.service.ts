"use server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "STRIPE" | "CASH";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  transactionId: string;
  stripeSessionId: string | null;
  paymentGateway: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  booking: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    tutor: {
      id: string;
      hourlyRate: number;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
}

export interface InitPaymentResponse {
  checkoutUrl: string | null;
  sessionId: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaymentFilters {
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

function buildQueryString(filters: PaymentFilters): string {
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

// POST /api/v1/payments/init  (STUDENT only)
export async function initializePayment(
  bookingId: string
): Promise<ServiceResponse<InitPaymentResponse>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/payments/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ bookingId }),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Payment initialization failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[initializePayment]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/payments/  (ADMIN only)
export async function getAllPayments(
  filters: PaymentFilters = {}
): Promise<PaginatedResponse<Payment[]>> {
  try {
    const accessToken = await getAccessToken();
    const qs = buildQueryString(filters);

    const result = await fetch(`${API}/api/v1/payments${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, meta: null, error: json?.message ?? "Failed to fetch payments" };
    }

    return {
      data: json?.data ?? [],
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getAllPayments]", message);
    return { data: null, meta: null, error: message };
  }
}

// GET /api/v1/payments/:bookingId  (STUDENT, TUTOR, ADMIN)
export async function getPaymentByBookingId(
  bookingId: string
): Promise<ServiceResponse<Payment>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/payments/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Payment not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getPaymentByBookingId]", message);
    return { data: null, error: message };
  }
}