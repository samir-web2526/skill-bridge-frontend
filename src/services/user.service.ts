"use server"

import { cookies } from "next/headers";
import { env } from "process";

const AUTH_URL = env.AUTH_URL;
export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    console.log(cookieStore.toString());
    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      cache: "no-store",
    });

    const session = await res.json();
    if (session === null) {
      return { data: null, error: { message: "Session is missing." } };
    }

    return { data: session, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: { message: "Something Went Wrong" } };
  }
};

export const getUser = async () => {
  try {
    const cookieStore = cookies();
    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      cache: "no-store",
    });

    const session = await res.json();
    if (!session) return null;
    return session.user; // যদি session obj এর মধ্যে user থাকে
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const logOut = async()=>{
    try {
      const cookieStore = await cookies();
      cookieStore.delete("better-auth.session_token");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
};
