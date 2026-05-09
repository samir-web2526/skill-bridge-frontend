"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, GraduationCap, Mail, MapPin, Phone, ShieldCheck, User, Users, Pencil } from "lucide-react";
import { StudentProfileEditDialog } from "./ProfileEditDialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props { profile: any; user: any; }

export default function StudentProfileContent({ profile, user }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const isActive = (profile?.user?.status ?? "ACTIVE") === "ACTIVE";

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">

            {/* Banner */}
            <div className="relative h-28 bg-primary overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 520 112" preserveAspectRatio="xMidYMid slice">
                <circle cx="420" cy="30" r="70" fill="#fff" />
                <circle cx="60" cy="90" r="50" fill="#fff" />
                <circle cx="260" cy="-10" r="60" fill="#fff" />
              </svg>
              <div className="absolute top-4 right-5 flex items-center gap-1.5 opacity-30">
                <div className="w-6 h-6 rounded-md bg-card/30 flex items-center justify-center">
                  <BookOpen size={12} className="text-white" />
                </div>
                <span className="font-bold text-white text-sm">Skill<span className="text-primary-foreground/70">Bridge</span></span>
              </div>
            </div>

            {/* Avatar + actions */}
            <div className="px-6 pb-5">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-primary/20" />
                  <Avatar className="relative h-20 w-20 border-4 border-card shadow-md">
                    <AvatarImage src={profile?.user?.image ?? ""} alt={user.name} />
                    <AvatarFallback className="text-lg font-extrabold bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={() => setOpen(true)} variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 border-primary/20 bg-primary/5 text-primary font-bold h-8">
                    <Pencil size={12} />
                    Edit Profile
                  </Button>
                  <Badge className={`rounded-full px-3 py-1 text-xs font-semibold border flex items-center gap-1.5 ${isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-primary animate-pulse" : "bg-destructive"}`} />
                    {profile?.user?.status ?? "ACTIVE"}
                  </Badge>
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">{profile?.user?.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{profile?.user?.email}</p>
            </div>

            {/* Info rows */}
            <div className="border-t border-border divide-y divide-border">
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={profile?.user?.email ?? "—"} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={profile?.user?.phone ?? "—"} />
              <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="Role" value={profile?.user?.role ?? "—"} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Gender" value={profile?.gender ?? "—"} />
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Date of Birth"
                value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={profile?.address ?? "—"} />
              <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="Class" value={profile?.class ?? "—"} />
              <InfoRow icon={<Users className="w-4 h-4" />} label="Group" value={profile?.group ?? "—"} />
            </div>

            {/* Stats footer */}
            <div className="bg-muted/30 flex flex-row justify-between border-t border-border px-6 py-4">
              <div>
                <p className="text-2xl font-extrabold text-foreground">{profile?.class ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Class</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">{profile?.group ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Group
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <StudentProfileEditDialog open={open} onClose={() => setOpen(false)} profile={profile} onUpdate={() => router.refresh()} />
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm shadow-primary/10 dark:shadow-none">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}