import { Navbar } from "@/components/pages/sharedPages/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUser } from "@/lib/auth/session";

import React from "react";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
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
