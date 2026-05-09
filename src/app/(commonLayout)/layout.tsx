import { Navbar } from "@/components/pages/sharedPages/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/auth";

import React from "react";

import { Footer } from "@/components/pages/sharedPages/Footer";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={
          user ? { name: user.name, email: user.email, role: user.role } : null
        }
      />
      <main className="flex-1 w-full">
        <TooltipProvider>{children}</TooltipProvider>
      </main>
      <Footer />
    </div>
  );
}


