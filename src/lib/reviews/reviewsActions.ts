"use server";

import { PaginationMeta } from "@/components/ui/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API;

export type ReviewsResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  paginations: PaginationMeta;
};
export async function getAllReviews(
  page: number,
  limit = 10,
): Promise<ReviewsResult | null> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${BASE_URL}/api/reviews?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch reviews");

    const json = await res.json();
    return json.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[getAllReviews]", err.message);
    return null;
  }
}
