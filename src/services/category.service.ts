"use server"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { cookies } from "next/headers";

export const createCategory = async (payload: { name: string }) => {
  const cookieStore = await cookies();
  const res = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return await res.json();
};

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await res.json();
    return categories;
  } catch (error) {
    console.error("Category fetch error:", error);
    return [];
  }
};