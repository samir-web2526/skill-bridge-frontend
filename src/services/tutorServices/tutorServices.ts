"use server";

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

