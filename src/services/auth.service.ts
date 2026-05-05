"use server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  image: string | null;
  role: Role;
  status: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Student registration payload
export interface RegisterStudentPayload {
  name: string;
  email: string;
  password: string;
  role: "STUDENT";
  phone?: string;
  image?: string;
  gender?: string;
  dateOfBirth?: string;   // "YYYY-MM-DD"
  address?: string;
  class?: string;
  group?: string;
}

// Tutor registration payload
export interface RegisterTutorPayload {
  name: string;
  email: string;
  password: string;
  role: "TUTOR";
  phone?: string;
  image?: string;
  gender?: string;
  bio?: string;
  hourlyRate: number;
  experience: string;
  categoryId: string;
  availableFrom: string;  // "HH:MM"
  availableTo: string;    // "HH:MM"
}

export type RegisterPayload = RegisterStudentPayload | RegisterTutorPayload;

export interface LoginPayload {
  email: string;
  password: string;
}

// Consistent response wrapper
export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ─── Services ─────────────────────────────────────────────────────────────────

// POST /api/v1/auth/register
export async function register(
  payload: RegisterPayload
): Promise<ServiceResponse<AuthUser>> {
  try {
    const result = await fetch(`${API}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Registration failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[register]", message);
    return { data: null, error: message };
  }
}

// POST /api/v1/auth/login
export async function login(
  payload: LoginPayload
): Promise<ServiceResponse<AuthTokens>> {
  try {
    const result = await fetch(`${API}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Login failed" };
    }

    // cookie store e token set kore dao
    const cookieStore = cookies();
    (await cookieStore).set("accessToken", json?.data?.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
    (await cookieStore).set("refreshToken", json?.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[login]", message);
    return { data: null, error: message };
  }
}

// POST /api/v1/auth/refresh-token
export async function refreshToken(): Promise<ServiceResponse<{ accessToken: string }>> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("refreshToken")?.value ?? "";

    const result = await fetch(`${API}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token }),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Token refresh failed" };
    }

    // নতুন accessToken cookie তে update kore dao
    (await cookieStore).set("accessToken", json?.data?.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[refreshToken]", message);
    return { data: null, error: message };
  }
}

// Logout — cookie clear kore dao
export async function logout(): Promise<void> {
  const cookieStore = cookies();
  (await cookieStore).delete("accessToken");
  (await cookieStore).delete("refreshToken");
}