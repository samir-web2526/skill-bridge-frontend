import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Mail, Phone, ShieldCheck, Star, User } from "lucide-react";
import { getTutorProfile } from "@/lib/auth/tutorActions/actions";

export default async function TutorProfilePage() {
  const user = await getUser();
  if (!user) redirect("/sign-in");

   const profile = await getTutorProfile();
   console.log("profile:", profile);

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your tutor account information</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 overflow-hidden">
        {/* Top banner */}
        <div className="h-24 bg-linear-to-r from-zinc-900 to-zinc-700" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="text-lg font-bold bg-zinc-800 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Badge
              variant="outline"
              className={`mb-1 text-xs font-semibold ${
                profile?.isAvailable
                  ? "border-green-300 text-green-700 bg-green-50"
                  : "border-red-300 text-red-700 bg-red-50"
              }`}
            >
              {profile?.isAvailable ? "Available" : "Not Available"}
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {profile?.bio && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Info rows */}
        <div className="border-t border-zinc-100 divide-y divide-zinc-100">
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone ?? "—"} />
          <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="Role" value={user.role} />
          <InfoRow icon={<User className="w-4 h-4" />} label="Status" value={user.status ?? "ACTIVE"} />
          <InfoRow
            icon={<BookOpen className="w-4 h-4" />}
            label="Category"
            value={profile?.category?.name ?? "—"}
          />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="Experience"
            value={profile?.experience ? `${profile.experience} years` : "—"}
          />
          <InfoRow
            icon={<Star className="w-4 h-4" />}
            label="Hourly Rate"
            value={profile?.hourlyRate ? `৳${profile.hourlyRate}/hr` : "—"}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}