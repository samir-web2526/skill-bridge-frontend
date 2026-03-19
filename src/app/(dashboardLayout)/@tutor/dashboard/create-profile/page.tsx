import BecomeTutorForm from "@/components/pages/dashboardPages/tutorPages/CreateTutorProfile";
import { getAllCategories } from "@/lib/auth/adminActions/actions";

import { getTutorProfile } from "@/lib/auth/tutorActions/actions";
import { redirect } from "next/navigation";

export default async function BecomeTutorPage() {
  const profile = await getTutorProfile();

  if (profile) redirect("/dashboard");

  const categoriesResult = await getAllCategories(1, 100);
  const categories = categoriesResult?.data ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Become a Tutor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your tutor profile to start accepting students
        </p>
      </div>
      <BecomeTutorForm categories={categories} />
    </div>
  );
}