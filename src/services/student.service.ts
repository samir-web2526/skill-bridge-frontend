"use server";

import { ServiceResponse } from "@/types/sharedTypes";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

export interface StudentProfile {
  id: string;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  class: string | null;
  group: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    status: "ACTIVE" | "BANNED" | "PENDING";
  };
}

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

export async function getStudents(): Promise<
  ServiceResponse<StudentProfile[]>
> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return {
        data: null,
        error: json?.message ?? "Failed to fetch students",
      };
    }

    return {
      data: json?.data ?? [],
      error: null,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Something went wrong";

    console.error("[getStudents]", message);

    return {
      data: null,
      error: message,
    };
  }
}

export async function getMyProfile(): Promise<ServiceResponse<StudentProfile>> {
  try {
    const accessToken = await getAccessToken();
    const result = await fetch(`${API}/api/v1/students/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    const json = await result.json();
    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch profile" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getProfile]", message);
    return { data: null, error: message };
  }
}

export async function updateMyStudentProfile(payload: {
  name?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  class?: string;
  group?: string;
}): Promise<ServiceResponse<StudentProfile>> {

  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/students/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return {
        data: null,
        error: json?.message ?? "Failed to update profile",
      };
    }

    return {
      data: json?.data ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateMyStudentProfile]", message);
    return { data: null, error: message };
  }
}