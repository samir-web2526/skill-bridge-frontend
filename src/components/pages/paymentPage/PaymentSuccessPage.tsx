"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md w-full shadow-sm">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6">
          Your payment has been processed successfully. You can view your booking details or return to the homepage.
        </p>

        {/* Session ID */}
        {sessionId && (
          <div className="bg-zinc-50 border border-border rounded-xl px-4 py-3 mb-8">
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
              Session ID
            </p>
            <p className="text-xs font-mono text-zinc-600 break-all">{sessionId}</p>
          </div>
        )}

        {/* Actions */}
        <div>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-8 py-3 rounded-xl border border-transparent transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}