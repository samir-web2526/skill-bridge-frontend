/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationMeta } from "@/components/ui/Pagination";
import { FormattedTutor } from "@/components/pages/tutorPage/TutorCard";
import { TutorFilters } from "@/components/pages/tutorPage/TutorFilter";

const BASE_URL = process.env.NEXT_PUBLIC_API;

export type TutorsResult = {
  data: FormattedTutor[];
  paginations: PaginationMeta;
};

export async function getTutors(
  filters: TutorFilters,
  page: number,
  limit = 8,
): Promise<TutorsResult | null> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (filters.search) params.set("search", filters.search);
    if (filters.category !== "All") params.set("category", filters.category);
    if (filters.minPrice !== undefined)
      params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters.minRating !== undefined)
      params.set("minRating", String(filters.minRating));
    if (filters.availableOnly) params.set("availableOnly", "true");

    const res = await fetch(`${BASE_URL}/api/tutors?${params.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch tutors");

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[fetchTutors]", err.message);
    return null;
  }
}

export async function getTutorById(tutorId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/tutors/${tutorId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data as FormattedTutor;
  } catch (err: any) {
    console.error("[getTutorById]", err.message);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.data.map((c: { name: string }) => c.name);
  } catch {
    return [];
  }
}

export type Stats = {
  totalTutors: number;
  totalStudents: number;
  satisfactionPercent: number;
};

export async function getStats(): Promise<Stats | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/tutors/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    const json = await res.json();
    return json.data as Stats;
  } catch (err: any) {
    console.error("[getStats]", err.message);
    return null;
  }
}