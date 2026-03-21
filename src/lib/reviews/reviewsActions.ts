/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaginationMeta } from "@/components/ui/Pagination";

const BASE_URL = process.env.NEXT_PUBLIC_API;

export type ReviewsResult = {
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

    const res = await fetch(`${BASE_URL}/api/reviews?${params.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch reviews");

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("[getAllReviews]", err.message);
    return null;
  }
}
