"use server"
import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const createBooking = async (payload: any, userId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        userId,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("Booking error:", error)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}


export const getAllBookings = async () => {
  try {

    const cookieStore = await cookies();

    const res = await fetch(
      `${API_URL}/api/bookings`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch bookings");
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);
    return { data: [], paginations: {} };
  }
};