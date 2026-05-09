"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mail, Phone, ShieldCheck, User, Pencil } from "lucide-react";
import { AdminProfileEditDialog } from "./AdminProfileEditDialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  user: any;
}

export default function AdminProfileContent({ user }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-10">
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
                  <Avatar className="relative h-20 w-20 border-4 border-card shadow-md">
                    <AvatarImage src={user.image ?? ""} alt={user.name} />
                    <AvatarFallback className="text-lg font-extrabold bg-emerald-700 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl flex items-center gap-1.5 border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold h-8"
                  >
                    <Pencil size={12} />
                    Edit
                  </Button>
                  <Badge className="mb-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-full px-3 py-1 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse inline-block" />
                    {user.status ?? "ACTIVE"}
                  </Badge>
                </div>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            </div>

            <div className="border-t border-border divide-y divide-border">
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={user.phone ?? "—"}
              />
              <InfoRow
                icon={<ShieldCheck className="w-4 h-4" />}
                label="Role"
                value={user.role}
              />
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Status"
                value={user.status ?? "ACTIVE"}
              />
            </div>
          </div>
        </div>
      </div>

      <AdminProfileEditDialog
        open={open}
        onClose={() => setOpen(false)}
        user={user}
        onUpdate={() => router.refresh()}
      />
    </>
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
