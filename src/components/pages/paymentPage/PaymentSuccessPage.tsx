// src/components/Pages/PaymentSuccessPage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-3">Payment Successful!</h1>
        <p>Session ID: {sessionId}</p>
        <p className="text-slate-400 mb-8">
          Your payment has been processed successfully.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}