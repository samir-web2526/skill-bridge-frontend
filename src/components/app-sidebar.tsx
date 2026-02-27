"use client"

import * as React from "react"
import {
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const ADMIN_navMain = [
  {
    title: "Admin Dashboard",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Profile",
        url: "dashboard/me",
      },
      {
        title: "All Booking",
        url: "/dashboard/booking",
      },
      {
        title: "All Tutors",
        url: "/dashboard/tutors",
      },
      {
        title: "Add Category",
        url: "/dashboard/category",
      },
    ],
  },
];

const STUDENT_navMain = [
  {
    title: "Student Dashboard",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Profile",
        url: "/dashboard/me",
      },
      {
        title: "Bookings",
        url: "/dashboard/bookings",
      },
      {
        title: "Manage Booking",
        url: "/dashboard/manage",
      },
    ],
  },
];

const TUTOR_navMain = [
  {
    title: "Tutor Dashboard",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Profile",
        url: "/dashboard/me",
      },
      {
        title: "Booking",
        url: "/dashboard/booking",
      },
      {
        title: "Manage Booking",
        url: "/dashboard/manage",
      },
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "ADMIN" | "STUDENT" | "TUTOR";
}


export function AppSidebar({userRole, ...props }: AppSidebarProps) {

   let navItem = null;
  if (userRole === "ADMIN") {
    navItem = ADMIN_navMain;
  } else if (userRole === "STUDENT") {
    navItem = STUDENT_navMain;
  } else {
    navItem = TUTOR_navMain;
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItem} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
