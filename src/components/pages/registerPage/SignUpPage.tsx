/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@/services/auth.service";

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
      if (!res.error && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //   name: "",
  //   email: "",
  //   password: "",
  //   role: "STUDENT",
  // }
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      gender: undefined,
      // Student fields
      dateOfBirth: "",
      address: "",
      class: "",
      group: "",
      // Tutor fields
      bio: "",
      hourlyRate: "",
      experience: "",
      categoryId: "",
      availableFrom: "",
      availableTo: "",
    } as any,
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
        <div className="flex justify-center mb-8">
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
