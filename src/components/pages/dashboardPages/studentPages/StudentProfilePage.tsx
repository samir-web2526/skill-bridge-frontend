import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getMyProfile } from "@/services/student.service";



export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getMyProfile();

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Banner */}
            <div className="relative h-28 bg-emerald-700 overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 520 112"
                preserveAspectRatio="xMidYMid slice"
              >
                <circle cx="420" cy="30" r="70" fill="#fff" />
                <circle cx="60" cy="90" r="50" fill="#fff" />
                <circle cx="260" cy="-10" r="60" fill="#fff" />
              </svg>
              <div className="absolute top-4 right-5 flex items-center gap-1.5 opacity-30">
                <div className="w-6 h-6 rounded-md bg-card/30 flex items-center justify-center">
                  <BookOpen size={12} className="text-white" />
                </div>
                <span className="font-bold text-white text-sm">
                  Skill<span className="text-emerald-300">Bridge</span>
                </span>
              </div>
            </div>

            {/* Avatar + Status */}
            <div className="px-6 pb-5">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-emerald-500/20" />
                  <Avatar className="relative h-20 w-20 border-4 border-card shadow-md">
                    <AvatarImage
                      src={profile.data?.user.image ?? ""}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-lg font-extrabold bg-emerald-700 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <Badge
                  className={`mb-1 rounded-full px-3 py-1 text-xs font-semibold border flex items-center gap-1.5 ${
                    profile.data?.user.status === "ACTIVE"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                      : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      profile.data?.user.status === "ACTIVE"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-red-400"
                    }`}
                  />
                  {profile.data?.user.status ?? "ACTIVE"}
                </Badge>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {profile.data?.user.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile.data?.user.email}
              </p>
            </div>

            {/* Info Rows */}
            <div className="border-t border-border divide-y divide-border">
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={profile.data?.user.email ?? "—"}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={profile.data?.user.phone ?? "—"}
              />
              <InfoRow
                icon={<ShieldCheck className="w-4 h-4" />}
                label="Role"
                value={profile.data?.user.role ?? "—"}
              />
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Gender"
                value={profile.data?.gender ?? "—"}
              />
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Date of Birth"
                value={
                  profile.data?.dateOfBirth
                    ? new Date(profile.data.dateOfBirth).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "long", year: "numeric" }
                      )
                    : "—"
                }
              />
              <InfoRow
                icon={<MapPin className="w-4 h-4" />}
                label="Address"
                value={profile.data?.address ?? "—"}
              />
              <InfoRow
                icon={<GraduationCap className="w-4 h-4" />}
                label="Class"
                value={profile.data?.class ?? "—"}
              />
              <InfoRow
                icon={<Users className="w-4 h-4" />}
                label="Group"
                value={profile.data?.group ?? "—"}
              />
            </div>
          </div>
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
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
