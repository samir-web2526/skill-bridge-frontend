import { redirect } from "next/navigation";
import { getMyTutorProfile } from "@/services/tutors.service";
import { getCurrentUser } from "@/lib/auth";
import TutorProfileContent from "./TutorProfileContent";

export default async function TutorProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getMyTutorProfile();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
          Tutor Dashboard
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          My Profile
        </h1>
      </div>

      <TutorProfileContent profile={profile.data} user={user} />
    </div>
  );
}
