import TutorDetailPage from "@/components/pages/tutorPage/TutorDetailPage";
import { getTutorById } from "@/services/tutors.services";
import { getUser } from "@/lib/auth/session";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tutor = await getTutorById((await params).id);
  const user = await getUser();

  if (!tutor) {
    return notFound();
  }
  return (
    <div>
      <TutorDetailPage tutor={tutor} user={user}></TutorDetailPage>
    </div>
  );
}
