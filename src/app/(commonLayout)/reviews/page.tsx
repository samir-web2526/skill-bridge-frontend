import AllReviewPage from "@/components/pages/ReviewPage/ReviewsPage";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AllReviewPage />
      </Suspense>
    </div>
  );
}
