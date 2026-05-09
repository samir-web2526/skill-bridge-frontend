// import { formatTutor } from "@/components/pages/tutorPage/TutorCard";
// import TutorDetailPage from "@/components/pages/tutorPage/TutorDetailPage";
// import { getCurrentUser } from "@/lib/auth";
// import { getTutorById } from "@/services/tutors.service";
// import { notFound } from "next/navigation";

// export const dynamic = "force-dynamic";

// export default async function TutorPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const result = await getTutorById((await params).id);
//   const tutor = formatTutor(result.data!);

//   const user = await getCurrentUser();

//   if (!tutor) {
//     return notFound();
//   }
//   return (
//     <div>
//       <TutorDetailPage tutor={tutor} user={user}></TutorDetailPage>
//     </div>
//   );
// }

import TutorDetailPage from "@/components/pages/tutorPage/TutorDetailPage";
import { getCurrentUser } from "@/lib/auth";
import { getTutorById, getTutors } from "@/services/tutors.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getTutorById(id);

  if (!result.data) {
    return notFound();
  }

  const tutor = result.data;
  
  // Fetch related tutors (same category, different ID)
  const relatedResult = await getTutors({
    category: tutor.category?.name,
    page: 1,
    limit: 4,
  });
  
  const relatedTutors = relatedResult.data?.filter((t) => t.id !== id).slice(0, 3) ?? [];

  const user = await getCurrentUser();

  return (
    <div>
      <TutorDetailPage 
        tutor={tutor as any} 
        user={user} 
        relatedTutors={relatedTutors as any} 
      />
    </div>
  );
}

