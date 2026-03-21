/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("better-auth.session_token");
    console.log("token", token);
    if (!token) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/auth/get-session`,
      {
        cache: "no-store",
        headers: {
          Cookie: `better-auth.session_token=${token.value}`,
          Origin: process.env.FRONTEND_URL || "http://localhost:3000",
        },
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    console.log("session response:", JSON.stringify(data));
    return data;
  } catch (err: any) {
    console.error("[getSession]", err.message);
    return null;
  }
}

export async function getUser() {
  try {
    const session = await getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id as string,
      name: session.user.name as string,
      email: session.user.email as string,
      role: session.user.role as "ADMIN" | "STUDENT" | "TUTOR",
      status: (session.user.status ?? "ACTIVE") as "ACTIVE" | "BANNED",
      phone: (session.user.phone ?? null) as string | null,
      image: (session.user.image ?? null) as string | null,
    };
  } catch (err: any) {
    console.error("[getUser]", err.message);
    return null;
  }
}

export async function saveSessionCookie(token: string) {
  try {
    console.log("saving token:", token);
    const cookieStore = await cookies();
    cookieStore.set("better-auth.session_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err: any) {
    console.error("[saveSessionCookie]", err.message);
  }
}
