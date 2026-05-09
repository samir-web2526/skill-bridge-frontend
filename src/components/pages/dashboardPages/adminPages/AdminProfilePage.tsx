import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminProfileContent from "./AdminProfileContent";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
          Account
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
      </div>

      <AdminProfileContent user={user} />
    </div>
  );
}
