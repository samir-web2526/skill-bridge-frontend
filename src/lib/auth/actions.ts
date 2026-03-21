/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";
import { saveSessionCookie } from "./session";
import { redirect } from "next/navigation";

export async function signIn(data: { email: string; password: string }) {
  try {
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
  } catch (err: any) {
    console.error("[signIn]", err.message);
    return { error: err.message || "Something went wrong" };
  }
}

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
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
  } catch (err: any) {
    console.error("[signUp]", err.message);
    return { error: err.message || "Something went wrong" };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
  } catch (err: any) {
    console.error("[logout]", err.message);
  } finally {
    redirect("/sign-in");
  }
}
