"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export interface CurrentUser {
    name:string;
  id: string;
  email: string;
  role: Role;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;

    if (!token) return null;

    const decoded = jwtDecode<CurrentUser>(token);

    return decoded;
  } catch {
    return null;
  }
}