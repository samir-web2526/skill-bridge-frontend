import { formatTutor } from "@/components/pages/tutorPage/TutorCard";
import TutorDetailPage from "@/components/pages/tutorPage/TutorDetailPage";
import { getCurrentUser } from "@/lib/auth";
import { getTutorById } from "@/services/tutors.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const result = await getTutorById((await params).id);
  const tutor = formatTutor(result.data!);

  const user = await getCurrentUser();

  if (!tutor) {
    return notFound();
  }
  return (
    <div>
      <TutorDetailPage tutor={tutor} user={user}></TutorDetailPage>
    </div>
  );
}
