"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createCategory } from "@/services/category.service"

const formSchema = z.object({
  name: z.string()
})

export function CategoryForm() {
  const [loading, setLoading] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    setLoading(true)
    const res = await createCategory(data) // তুমি already বানানো API কল
    toast.success("Category created successfully")
    form.reset() // form clear
    console.log("Created category:", res)
  } catch (error: any) {
    toast.error(error?.message || "Failed to create category")
  } finally {
    setLoading(false)
  }
}

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-center">Create Category</CardTitle>
        <CardDescription className="flex justify-center">
          Help Tutor to Create profile based on their skill.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Category Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter category name"
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
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

