"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await signIn(data);
    console.log(result);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.success) {
      toast.success("User sign in successfully");
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className=" flex justify-center mt-20">
      <Card className="w-full flex sm:max-w-md border border-blue-900">
        <CardHeader>
          <CardTitle className="flex justify-center">Sign In Form </CardTitle>
          <CardDescription className="flex justify-center">
            Welcome back! Please enter your credentials to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-data" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-email">Your Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="off"
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-email">Your Password</FieldLabel>
                    <Input
                      {...field}
                      id="form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="vertical">
            <Button type="submit" form="form-data">
              Sign In
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
              {"Don't have an account?"}{" "}
              <a
                href="/sign-up"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </a>
            </p>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
