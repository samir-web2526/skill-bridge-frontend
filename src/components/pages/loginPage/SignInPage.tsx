"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { googleLogin, login } from "@/services/auth.service";
import { GoogleLogin } from "@react-oauth/google";

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const DEMO_CREDENTIALS = [
  {
    role: "Student",
    email: "student1@gmail.com",
    password: "123456",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  },
  {
    role: "Tutor",
    email: "tutor1@gmail.com",
    password: "123456",
    color: "text-secondary-foreground",
    bg: "bg-secondary",
    border: "border-border"
  },
  {
    role: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
    color: "text-accent-foreground",
    bg: "bg-accent",
    border: "border-border"
  },
];

const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.classList.add("ring-2", "ring-ring/20", "border-ring");
};

const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.classList.remove("ring-2", "ring-ring/20", "border-ring");
};

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await login(data);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Signed in successfully!");
    router.refresh();
    router.push("/dashboard");
  }

  const handleDemoLogin = async (cred: typeof DEMO_CREDENTIALS[0]) => {
    setDemoLoading(cred.role);
    const result = await login({ email: cred.email, password: cred.password });
    if (result?.error) {
      toast.error(result.error);
      setDemoLoading(null);
      return;
    }
    toast.success(`Signed in as ${cred.role}!`);
    router.refresh();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background px-4 gap-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
      </div>

      <div
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl shadow-primary/5"
      >
        <h1 className="text-[22px] font-bold text-foreground leading-tight">
          Welcome back
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1.5 mb-6">
          Sign in to continue your learning journey
        </p>

        {/* Demo Credentials */}
        <div className="mb-6">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Quick demo access
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                disabled={demoLoading !== null}
                onClick={() => handleDemoLogin(cred)}
                className={`flex items-center justify-center px-2 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-tight transition-all duration-150 hover:brightness-95 active:scale-95 disabled:opacity-50 ${cred.bg} ${cred.border} ${cred.color}`}
              >
                {demoLoading === cred.role ? "..." : cred.role}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Social Login</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-[356px] h-[40px] overflow-hidden rounded-xl relative bg-black">
            <div className="absolute left-[-44px] top-0">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    const result = await googleLogin(credentialResponse.credential);
                    if (result.error) {
                      toast.error(result.error);
                    } else {
                      toast.success("Signed in with Google!");
                      router.refresh();
                      router.push("/dashboard");
                    }
                  }
                }}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
                theme="filled_black"
                shape="rectangular"
                width="400px"
              />
            </div>
          </div>
        </div>


        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">or email</span>
          <div className="flex-1 h-px bg-border" />
        </div>


        <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-4">
                  <FieldLabel
                    htmlFor="signin-email"
                    className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signin-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="off"
                    className="h-11 rounded-xl bg-muted/30 border-border text-sm focus-visible:ring-0 transition-all"
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-6">
                  <FieldLabel
                    htmlFor="signin-password"
                    className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      className="h-11 rounded-xl bg-muted/30 border-border text-sm focus-visible:ring-0 pr-10 transition-all"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            form="signin-form"
            className="w-full h-11 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 border-0 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/20"
          >
            Sign In
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-[13px] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-bold text-primary hover:text-primary/90 transition-colors"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
