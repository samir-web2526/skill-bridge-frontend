import { Navbar } from "@/components/pages/sharedPages/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth";

import React from "react";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar
        user={
          user ? { name: user.name, email: user.email, role: user.role } : null
        }
      />
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
