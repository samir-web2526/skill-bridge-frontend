/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { register } from "@/services/auth.service";
import { getCategories, Category } from "@/services/category.service";

// ─── Schema ───────────────────────────────────────────────────────────────────

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "TUTOR"]),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

const tutorSchema = baseSchema.extend({
  role: z.literal("TUTOR"),
  bio: z.string().min(10),
  hourlyRate: z.number().min(1), 
  experience: z.number().min(1),
  categoryId: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  availableFrom: z.string().min(1),
  availableTo: z.string().min(1),
});
const studentSchema = baseSchema.extend({
  role: z.literal("STUDENT"),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  class: z.string().optional(),
  group: z.string().optional(),
});

const formSchema = z.discriminatedUnion("role", [tutorSchema, studentSchema]);

type FormValues = z.infer<typeof formSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  e.currentTarget.style.borderColor = "#0d7a5f";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,122,95,0.1)";
};

const inputBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  e.currentTarget.style.borderColor = "";
  e.currentTarget.style.boxShadow = "none";
};

const sharedInputClass =
  "h-10 rounded-[10px] bg-muted/40 border-border text-sm focus-visible:ring-0";
const sharedSelectClass =
  "h-10 w-full rounded-[10px] border border-border bg-muted/40 px-3 text-sm text-foreground outline-none transition-all";

// ─── Component ────────────────────────────────────────────────────────────────

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);

  // Fetch categories once on mount
  React.useEffect(() => {
    getCategories({ limit: 100 }).then((res) => {
      if (!res.error && res.data){
        setCategories(res.data);
        // setCategories(Array.isArray(res.data) ? res.data : [res.data]);
      }
    });
  }, []);

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
  name: "",
  email: "",
  password: "",
  role: "STUDENT",
}
});

  async function onSubmit(values: FormValues) {
    console.log("ERRORS:", form.formState.errors);
  console.log("VALUES:", values);
  const payload: any = {
    name: values.name,
    email: values.email,
    password: values.password,
    role: values.role,
    gender: values.gender,
  };

  if (values.role === "TUTOR") {
  payload.bio = values.bio;
  payload.hourlyRate = values.hourlyRate;
  payload.experience = values.experience;
  payload.categoryId = values.categoryId;
  payload.availableFrom = values.availableFrom;
  payload.availableTo = values.availableTo;
} else {
    payload.dateOfBirth = (values as any).dateOfBirth || undefined;
    payload.address = (values as any).address || undefined;
    payload.class = (values as any).class || undefined;
    payload.group = (values as any).group || undefined;
  }

  const result = await register(payload);
  if (result.error) { toast.error(result.error); return; }
  toast.success("Account created successfully!");
  router.push("/login");
}
const role = useWatch({ control: form.control, name: "role" });
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background px-4 gap-4 py-10">
      <style>{`
        @keyframes shadowFloat {
          0%   { box-shadow: 0 4px 16px -4px rgba(13,122,95,0.12), 0 1px 4px -1px rgba(13,122,95,0.08); }
          50%  { box-shadow: 0 20px 48px -8px rgba(13,122,95,0.28), 0 8px 24px -4px rgba(13,122,95,0.16); }
          100% { box-shadow: 0 4px 16px -4px rgba(13,122,95,0.12), 0 1px 4px -1px rgba(13,122,95,0.08); }
        }
      `}</style>

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

            {/* ── Role (show first so fields below update) ── */}
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel htmlFor="signup-role" className="text-xs font-medium text-muted-foreground">
                    I am a
                  </FieldLabel>
                  <select
                    {...field}
                    id="signup-role"
                    className={sharedSelectClass}
                    style={{ boxShadow: "none" }}
                    onFocus={inputFocus}
                    onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TUTOR">Tutor</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Name ── */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel htmlFor="signup-name" className="text-xs font-medium text-muted-foreground">
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-name"
                    placeholder="Enter your name"
                    autoComplete="off"
                    className={sharedInputClass}
                    style={{ boxShadow: "none" }}
                    onFocus={inputFocus}
                    onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Email ── */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel htmlFor="signup-email" className="text-xs font-medium text-muted-foreground">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="off"
                    className={sharedInputClass}
                    style={{ boxShadow: "none" }}
                    onFocus={inputFocus}
                    onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Password ── */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel htmlFor="signup-password" className="text-xs font-medium text-muted-foreground">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      autoComplete="off"
                      className={`${sharedInputClass} pr-10`}
                      style={{ boxShadow: "none" }}
                      onFocus={inputFocus}
                      onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Gender (both roles) ── */}
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-2">
                  <FieldLabel htmlFor="signup-gender" className="text-xs font-medium text-muted-foreground">
                    Gender {role === "TUTOR" && <span className="text-red-500">*</span>}
                  </FieldLabel>
                  <select
                    {...field}
                    id="signup-gender"
                    className={sharedSelectClass}
                    style={{ boxShadow: "none" }}
                    onFocus={inputFocus}
                    onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ════════ TUTOR FIELDS ════════ */}
            {role === "TUTOR" && (
              <>
                {/* Category */}
                <Controller
                  name={"categoryId" as any}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mb-2">
                      <FieldLabel htmlFor="signup-category" className="text-xs font-medium text-muted-foreground">
                        Subject / Category <span className="text-red-500">*</span>
                      </FieldLabel>
                      <select
                        {...field}
                        id="signup-category"
                        className={sharedSelectClass}
                        style={{ boxShadow: "none" }}
                        onFocus={inputFocus}
                        onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Bio */}
                <Controller
                  name={"bio" as any}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mb-2">
                      <FieldLabel htmlFor="signup-bio" className="text-xs font-medium text-muted-foreground">
                        Bio <span className="text-red-500">*</span>
                      </FieldLabel>
                      <textarea
                        {...field}
                        id="signup-bio"
                        rows={3}
                        placeholder="Tell students about yourself..."
                        className="w-full rounded-[10px] border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none transition-all resize-none"
                        style={{ boxShadow: "none" }}
                        onFocus={inputFocus}
                        onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Hourly Rate + Experience (side by side) */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Controller
                    name={"hourlyRate" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-rate" className="text-xs font-medium text-muted-foreground">
                          Hourly Rate (৳) <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-rate"
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={1}
                          placeholder="e.g. 500"
                          className={sharedInputClass}
                          style={{ boxShadow: "none" }}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name={"experience" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-experience" className="text-xs font-medium text-muted-foreground">
                          Experience <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-experience"
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="e.g. 3 years"
                          className={sharedInputClass}
                          style={{ boxShadow: "none" }}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                {/* Available From + Available To */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Controller
                    name={"availableFrom" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-from" className="text-xs font-medium text-muted-foreground">
                          Available From <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-from"
                          type="time"
                          className={sharedInputClass}
                          style={{ boxShadow: "none" }}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name={"availableTo" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-to" className="text-xs font-medium text-muted-foreground">
                          Available To <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-to"
                          type="time"
                          className={sharedInputClass}
                          style={{ boxShadow: "none" }}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </>
            )}

            {/* ════════ STUDENT FIELDS ════════ */}
            {role === "STUDENT" && (
              <>
                {/* Date of Birth */}
                <Controller
                  name={"dateOfBirth" as any}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mb-2">
                      <FieldLabel htmlFor="signup-dob" className="text-xs font-medium text-muted-foreground">
                        Date of Birth
                      </FieldLabel>
                      <Input
                        {...field}
                        id="signup-dob"
                        type="date"
                        className={sharedInputClass}
                        style={{ boxShadow: "none" }}
                        onFocus={inputFocus}
                        onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Class + Group */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Controller
                    name={"class" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-class" className="text-xs font-medium text-muted-foreground">
                          Class
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-class"
                          placeholder="e.g. Class 10"
                          className={sharedInputClass}
                          style={{ boxShadow: "none" }}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name={"group" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-group" className="text-xs font-medium text-muted-foreground">
                          Group
                        </FieldLabel>
                        <select
                          {...field}
                          id="signup-group"
                          className={sharedSelectClass}
                          style={{ boxShadow: "none" }}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        >
                          <option value="">Select group</option>
                          <option value="Science">Science</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Humanities">Humanities</option>
                        </select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                {/* Address */}
                <Controller
                  name={"address" as any}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mb-2">
                      <FieldLabel htmlFor="signup-address" className="text-xs font-medium text-muted-foreground">
                        Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="signup-address"
                        placeholder="Your address"
                        className={sharedInputClass}
                        style={{ boxShadow: "none" }}
                        onFocus={inputFocus}
                        onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </>
            )}

          </FieldGroup>

          <Button
            type="submit"
            form="signup-form"
            disabled={form.formState.isSubmitting}
            className="w-full h-10 rounded-2xl text-sm font-medium text-white border-0 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4"
            style={{ background: "#0d7a5f" }}
          >
            {form.formState.isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-[13px] text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium hover:underline" style={{ color: "#0d7a5f" }}>
            login here
          </a>
        </p>
      </div>
    </div>
  );
}