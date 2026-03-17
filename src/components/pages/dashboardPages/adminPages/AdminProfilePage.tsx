import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, ShieldCheck, User } from "lucide-react";

export default async function AdminProfilePage() {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your account information</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 overflow-hidden">
        {/* Top banner */}
        <div className="h-24 bg-gradient-to-r from-zinc-900 to-zinc-700" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="text-lg font-bold bg-zinc-800 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Badge variant="outline" className="mb-1 text-xs font-semibold">
              {user.status ?? "ACTIVE"}
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        {/* Info rows */}
        <div className="border-t border-zinc-100 divide-y divide-zinc-100">
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone ?? "—"} />
          <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="Role" value={user.role} />
          <InfoRow icon={<User className="w-4 h-4" />} label="Status" value={user.status ?? "ACTIVE"} />
          <InfoRow icon={<CalendarDays className="w-4 h-4" />} label="Joined" value={joinedDate} />
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