"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTutorProfile } from "@/lib/auth/tutorActions/actions";

export default function BecomeTutorButton({
  role,
  className,
  children,
}: {
  role?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClick = async () => {
    if (!role) {
      router.push("/sign-up?role=tutor");
      return;
    }

    if (role !== "TUTOR") {
      toast.error("Your account is not registered as a tutor.", {
        description: "Please sign up with a tutor account to access this feature.",
      });
      return;
    }

    const profile = await getTutorProfile();

    if (profile) {
      toast.info("You already have a tutor profile.", {
        description: "Redirecting you to your dashboard.",
      });
      router.push("/dashboard");
    } else {
      toast.success("Let's get you set up!", {
        description: "Complete your tutor profile to start accepting students.",
      });
      router.push("/dashboard/become-tutor");
    }
  };

  return (
    <div onClick={handleClick} role="button" className={className} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}