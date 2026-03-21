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
import { signUp } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.string(),
});

const inputFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  e.currentTarget.style.borderColor = "#0d7a5f";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,122,95,0.1)";
};

const inputBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
) => {
  e.currentTarget.style.borderColor = "";
  e.currentTarget.style.boxShadow = "none";
};

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", role: "STUDENT" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await signUp(data);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.success) {
      toast.success("User sign up successfully");
      router.refresh();
      router.push("/sign-in");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background px-4 gap-4">
      <style>{`
        @keyframes shadowFloat {
          0%   { box-shadow: 0 4px 16px -4px rgba(13,122,95,0.12), 0 1px 4px -1px rgba(13,122,95,0.08); }
          50%  { box-shadow: 0 20px 48px -8px rgba(13,122,95,0.28), 0 8px 24px -4px rgba(13,122,95,0.16); }
          100% { box-shadow: 0 4px 16px -4px rgba(13,122,95,0.12), 0 1px 4px -1px rgba(13,122,95,0.08); }
        }
      `}</style>

      <div className="w-full max-w-md mt-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
      </div>

      <div
        className="w-full max-w-md bg-card border border-border rounded-[22px] p-8"
        style={{ animation: "shadowFloat 4s ease-in-out infinite" }}
      >
        <h1 className="text-[22px] font-medium text-foreground leading-tight">
          Create an account
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1.5 mb-6">
          Join us today and start your learning journey
        </p>

        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel
                    htmlFor="signup-name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
                    autoComplete="off"
                    className="h-10 rounded-[10px] bg-muted/40 border-border text-sm focus-visible:ring-0"
                    style={{ boxShadow: "none" }}
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel
                    htmlFor="signup-email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="off"
                    className="h-10 rounded-[10px] bg-muted/40 border-border text-sm focus-visible:ring-0"
                    style={{ boxShadow: "none" }}
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
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel
                    htmlFor="signup-password"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="At least 8 characters"
                      autoComplete="off"
                      className="h-10 rounded-[10px] bg-muted/40 border-border text-sm focus-visible:ring-0 pr-10"
                      style={{ boxShadow: "none" }}
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

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-5">
                  <FieldLabel
                    htmlFor="signup-role"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    I am a
                  </FieldLabel>
                  <select
                    {...field}
                    id="signup-role"
                    className="h-10 w-full rounded-[10px] border border-border bg-muted/40 px-3 text-sm text-foreground outline-none transition-all"
                    style={{ boxShadow: "none" }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TUTOR">Tutor</option>
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            form="signup-form"
            className="w-full h-10.5 rounded-2xl text-sm font-medium text-white border-0 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "#0d7a5f" }}
          >
            Create account
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-[13px] text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-medium hover:underline"
            style={{ color: "#0d7a5f" }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
