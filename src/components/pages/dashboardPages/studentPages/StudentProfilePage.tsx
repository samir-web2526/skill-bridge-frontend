import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMyProfile } from "@/services/student.service";
import StudentProfileContent from "./StudentProfileContent";

export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getMyProfile();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Student Dashboard
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          My Profile
        </h1>
      </div>

      <StudentProfileContent profile={profile.data} user={user} />
    </div>
  );
}
