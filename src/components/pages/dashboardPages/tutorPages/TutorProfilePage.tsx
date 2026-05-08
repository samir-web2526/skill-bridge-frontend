import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import { getMyTutorProfile } from "@/services/tutors.service";
import { getCurrentUser } from "@/lib/auth";



export default async function TutorProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getMyTutorProfile();


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
          Tutor Dashboard
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          My Profile
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
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

            <div className="px-6 pb-5">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-emerald-500/20" />
                  <Avatar className="relative h-20 w-20 border-4 border-white dark:border-zinc-900 shadow-md">
                    <AvatarImage src={profile.data?.user.name ?? ""} alt={user.name} />
                    <AvatarFallback className="text-lg font-extrabold bg-emerald-700 dark:bg-emerald-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <Badge
                  className={`mb-1 rounded-full px-3 py-1 text-xs font-semibold border flex items-center gap-1.5 ${
                    profile.data?.availability
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                      : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      profile?.data?.availability
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-red-400"
                    }`}
                  />
                  {profile?.data?.availability ? "Available" : "Not Available"}
                </Badge>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {profile?.data?.user.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{profile?.data?.user.email}</p>

              {profile?.data?.bio && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                  {profile.data?.bio}
                </p>
              )}
            </div>

            <div className="border-t border-border divide-y divide-border">
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={profile?.data?.user?.email ?? "_"}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={profile?.data?.user?.phone ?? "—"}
              />
              <InfoRow
                icon={<ShieldCheck className="w-4 h-4" />}
                label="Role"
                value={profile?.data?.user?.role ?? "_"}
              />
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Status"
                value={profile?.data?.user?.status ?? "ACTIVE"}
              />
              <InfoRow
                icon={<BookOpen className="w-4 h-4" />}
                label="Category"
                value={profile?.data?.category?.name ?? "—"}
              />
              <InfoRow
                icon={<Clock className="w-4 h-4" />}
                label="Experience"
                value={
                  profile?.data?.experience ? `${profile.data?.experience} years` : "—"
                }
              />
              <InfoRow
                icon={<Star className="w-4 h-4" />}
                label="Hourly Rate"
                value={profile?.data?.hourlyRate ? `৳${profile?.data?.hourlyRate}/hr` : "—"}
              />
            </div>

            {profile && (
              <div className="bg-card rounded-xl flex flex-row justify-between border border-border px-4 py-3">
                <div>
                  <p className="text-2xl font-extrabold text-amber-500">
                    {Number(profile?.data?.averageRating ?? 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex flex-col gap-0.5">
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              i < Math.round(profile?.data?.averageRating ?? 0)
                                ? "#fbbf24"
                                : "var(--muted-foreground)",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    <span>Avg rating</span>
                  </p>
                </div>
                <div className="bg-card rounded-xl border border-border px-4 py-3">
                  <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-500">
                    {profile?.data?.totalBookings ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Total sessions
                  </p>
                </div>
              </div>
            )}
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
      <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/10 dark:shadow-none">
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
