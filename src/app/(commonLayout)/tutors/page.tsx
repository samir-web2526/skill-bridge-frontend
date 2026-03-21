import TutorsPage from "@/components/pages/tutorPage/TutorsPage";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function AllTutorPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TutorsPage />
      </Suspense>
    </div>
  );
}
