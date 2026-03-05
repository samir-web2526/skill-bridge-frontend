"use server";
import { saveSessionCookie } from "./session";

export async function signIn(data: { email: string; password: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/auth/sign-in/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.FRONTEND_URL || "http://localhost:3000",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    const data = await res.json();
    return { error: data.message ?? "Something went wrong" };
  }

  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return { error: "No session cookie received" };
  const tokenValue = setCookie.split(";")[0].split("=").slice(1).join("=");
  await saveSessionCookie(decodeURIComponent(tokenValue));

  return { success: true };
}

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/auth/sign-up/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.FRONTEND_URL || "http://localhost:3000",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    const data = await res.json();
    return { error: data.message ?? "Something went wrong" };
  }

  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return { error: "No session cookie received" };
  const tokenValue = setCookie.split(";")[0].split("=").slice(1).join("=");
  await saveSessionCookie(decodeURIComponent(tokenValue));

  return { success: true };
}
