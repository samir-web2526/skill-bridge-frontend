"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const createReview = async (payload: {
  bookingId: string;
  tutorId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/reviews`, {
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
  } catch (error) {
    console.error("Review error:", error);
    return null;
  }
};

export const getReviewByBooking = async (bookingId: string) => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/reviews?bookingId=${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    const data = await res.json();
    return data.length ? data[0] : null;
  } catch (error) {
    console.error("Get review error:", error);
    return null;
  }
};
