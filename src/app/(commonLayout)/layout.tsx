import { Navbar } from "@/components/pages/sharedPages/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/auth/session";

import React from "react";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar user={session?.user || null}></Navbar>
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
