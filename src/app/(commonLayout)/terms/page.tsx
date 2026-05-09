"use client";

import { ShieldCheck, FileText, Scale, Lock } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      title: "Agreement to Terms",
      content: "By accessing or using SkillBridge, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      icon: <Scale className="w-5 h-5 text-emerald-600" />,
      title: "User Obligations",
      content: "Users must provide accurate information when creating an account. Students are responsible for honoring their booking commitments, and tutors are responsible for delivering quality educational services as described in their profiles."
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      title: "Privacy & Security",
      content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using SkillBridge, you consent to our data practices as described in the policy."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: "Termination",
      content: "We reserve the right to terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our platform. Last updated: May 2026.
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <div 
              key={idx}
              className="bg-card border border-border rounded-3xl p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-muted/30 rounded-3xl border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground">
            Questions about our Terms of Service? 
            <a href="/contact" className="ml-1 font-bold text-emerald-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
