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
import { login } from "@/services/auth.service";

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

        <div className="grid grid-cols-2 gap-3 mb-6">
           <Button
             variant="outline"
             type="button"
             className="h-11 rounded-xl border-border bg-card hover:bg-muted/50 gap-2 text-xs font-bold uppercase"
           >
             <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             Google
           </Button>
           <Button
             variant="outline"
             type="button"
             className="h-11 rounded-xl border-border bg-card hover:bg-muted/50 gap-2 text-xs font-bold uppercase"
           >
             <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
             </svg>
             Facebook
           </Button>
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