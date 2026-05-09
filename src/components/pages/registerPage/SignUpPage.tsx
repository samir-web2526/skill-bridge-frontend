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
import { Separator } from "@/components/ui/separator";

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

const inputFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  e.currentTarget.classList.add("ring-2", "ring-ring/20", "border-ring");
};

const inputBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  e.currentTarget.classList.remove("ring-2", "ring-ring/20", "border-ring");
};

const sharedInputClass =
  "h-11 rounded-xl bg-muted/30 border-border text-sm focus-visible:ring-0 transition-all";
const sharedSelectClass =
  "h-11 w-full rounded-xl border border-border bg-muted/30 px-3 text-sm text-foreground outline-none transition-all";

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
    <div className="flex flex-col justify-center items-center min-h-screen bg-background px-4 gap-4 py-20">
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
          Create an account
        </h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Sign up with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
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

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">or information</span>
          <div className="flex-1 h-px bg-border" />
        </div>


        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>

            {/* ── Role (show first so fields below update) ── */}
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-4">
                  <FieldLabel htmlFor="signup-role" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    I am a
                  </FieldLabel>
                  <select
                    {...field}
                    id="signup-role"
                    className={sharedSelectClass}
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

            <Separator className="mb-6" />

            {/* ── Name ── */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-4">
                  <FieldLabel htmlFor="signup-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-name"
                    placeholder="Enter your name"
                    autoComplete="off"
                    className={sharedInputClass}
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
                <Field data-invalid={fieldState.invalid} className="mb-4">
                  <FieldLabel htmlFor="signup-email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="off"
                    className={sharedInputClass}
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
                <Field data-invalid={fieldState.invalid} className="mb-4">
                  <FieldLabel htmlFor="signup-password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
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
                <Field data-invalid={fieldState.invalid} className="mb-4">
                  <FieldLabel htmlFor="signup-gender" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Gender {role === "TUTOR" && <span className="text-destructive">*</span>}
                  </FieldLabel>
                  <select
                    {...field}
                    id="signup-gender"
                    className={sharedSelectClass}
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
                    <Field data-invalid={fieldState.invalid} className="mb-4">
                      <FieldLabel htmlFor="signup-category" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Subject / Category <span className="text-destructive">*</span>
                      </FieldLabel>
                      <select
                        {...field}
                        id="signup-category"
                        className={sharedSelectClass}
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
                    <Field data-invalid={fieldState.invalid} className="mb-4">
                      <FieldLabel htmlFor="signup-bio" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Bio <span className="text-destructive">*</span>
                      </FieldLabel>
                      <textarea
                        {...field}
                        id="signup-bio"
                        rows={3}
                        placeholder="Tell students about yourself..."
                        className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none transition-all resize-none"
                        onFocus={inputFocus}
                        onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Hourly Rate + Experience (side by side) */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Controller
                    name={"hourlyRate" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-rate" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          Rate (৳/hr) <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-rate"
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={1}
                          placeholder="e.g. 500"
                          className={sharedInputClass}
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
                        <FieldLabel htmlFor="signup-experience" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          Exp (Years) <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-experience"
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="e.g. 3"
                          className={sharedInputClass}
                          onFocus={inputFocus}
                          onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                {/* Available From + Available To */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Controller
                    name={"availableFrom" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-from" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          From <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-from"
                          type="time"
                          className={sharedInputClass}
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
                        <FieldLabel htmlFor="signup-to" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          To <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-to"
                          type="time"
                          className={sharedInputClass}
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
                    <Field data-invalid={fieldState.invalid} className="mb-4">
                      <FieldLabel htmlFor="signup-dob" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Date of Birth
                      </FieldLabel>
                      <Input
                        {...field}
                        id="signup-dob"
                        type="date"
                        className={sharedInputClass}
                        onFocus={inputFocus}
                        onBlur={(e) => { field.onBlur(); inputBlur(e); }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Class + Group */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Controller
                    name={"class" as any}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-class" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          Class
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-class"
                          placeholder="e.g. 10"
                          className={sharedInputClass}
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
                        <FieldLabel htmlFor="signup-group" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          Group
                        </FieldLabel>
                        <select
                          {...field}
                          id="signup-group"
                          className={sharedSelectClass}
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
                    <Field data-invalid={fieldState.invalid} className="mb-4">
                      <FieldLabel htmlFor="signup-address" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="signup-address"
                        placeholder="Your full address"
                        className={sharedInputClass}
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
            className="w-full h-11 rounded-xl text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 border-0 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6 shadow-lg shadow-primary/20"
          >
            {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-[13px] text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-primary hover:text-primary/90 transition-colors">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
