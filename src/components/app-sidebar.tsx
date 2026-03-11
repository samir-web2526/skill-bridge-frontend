// components/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  Tag,
  Star,
  Search,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// ─── ADMIN NAV ───────────────────────────────────────────
const ADMIN_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: CalendarDays, // booking দেখা
      },
      {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: Star, // review delete
      },
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Tag, // create, update, delete
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
    ],
  },
];

// ─── STUDENT NAV ─────────────────────────────────────────
const STUDENT_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Find Tutors",
        url: "/dashboard/tutors",
        icon: Search,
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
        icon: CalendarDays, // সব booking এক জায়গায়, filter করে দেখাবে
      },
      {
        title: "My Reviews",
        url: "/dashboard/reviews",
        icon: Star,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
    ],
  },
];
// ─── TUTOR NAV ───────────────────────────────────────────
const TUTOR_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
        icon: CalendarDays, // সব booking এক জায়গায় দেখবে
      },
      {
        title: "My Reviews",
        url: "/dashboard/reviews",
        icon: Star, // students যে reviews দিয়েছে
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "ADMIN" | "STUDENT" | "TUTOR";
  userName: string;
  userEmail: string;
}

export function AppSidebar({
  userRole,
  userName,
  userEmail,
  ...props
}: AppSidebarProps) {
  let navItem = null;
  if (userRole === "ADMIN") {
    navItem = ADMIN_NAV;
  } else if (userRole === "TUTOR") {
    navItem = TUTOR_NAV;
  } else {
    navItem = STUDENT_NAV;
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Logo ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">SkillBridge</span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {userRole} Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Nav Items (role-based) ── */}
      <SidebarContent>
        <NavMain items={navItem} />
      </SidebarContent>

      {/* ── User Info ── */}
      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: userEmail,
            avatar: "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
