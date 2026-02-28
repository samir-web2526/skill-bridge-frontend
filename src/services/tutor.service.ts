"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllTutors = async () => {
  try {
    const res = await fetch(`${API_URL}/api/tutors`, {
      cache: "no-store",
    });

    if (!res) {
      throw new Error("Failed to fetch tutors");
    }

    const tutors = await res.json();
    return tutors;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTutorDetails = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/tutors/${id}`, {
      cache: "no-store",
    })

    if (!res) {
      throw new Error("Failed to fetch tutor")
    }

    const tutorDetails =  await res.json();
    return tutorDetails;
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteTutor = async (tutorId: string) => {
  try {
     const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/tutors/${tutorId}`, {
      method: "DELETE",
     headers:{
      Cookie:cookieStore.toString(),
     }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Delete tutor error:", error);
    throw error;
  }
};