
import PaymentSuccessPage from "@/components/pages/paymentPage/PaymentSuccessPage";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessPage />
    </Suspense>
  );
}