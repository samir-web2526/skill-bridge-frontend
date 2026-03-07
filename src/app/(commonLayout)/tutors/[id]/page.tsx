import TutorDetailPage from "@/components/pages/tutorPage/TutorDetailPage";
import { getTutorById } from "@/services/tutors.services";
import { notFound } from "next/navigation";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tutor = await getTutorById((await params).id);
  if (!tutor) {
    return notFound();
  }
  return (
    <div>
      <TutorDetailPage tutor={tutor}></TutorDetailPage>
    </div>
  );
}
