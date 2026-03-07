import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token");
  console.log("token", token);
  if (!token) {
    return null;
  }

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
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  console.log("session response:", JSON.stringify(data));
  return data;
}

// src/lib/auth/session.ts

export async function saveSessionCookie(token: string) {
  console.log("saving token:", token);
  const cookieStore = await cookies();
  cookieStore.set("better-auth.session_token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}
