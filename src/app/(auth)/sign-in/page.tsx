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
import Image from "next/image"
import Link from "next/link"

const formSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .max(100, "Email must be at most 100 characters."),

    key: z
      .string()
      .min(8, "Key must be at least 8 characters.")
      .max(64, "Key must be at most 64 characters."),
  });

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      key: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground
         mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="flex flex-col items-center gap-4">
        <Image
          src="/renderex.png"
          alt='Renderex-Logo'
          width={150}
          height={150}
          loading='eager'
          className='w-60 h-14'>
        </Image>
        <div className="text-center">
          <CardTitle>Sign in</CardTitle>
          <span>
            Enter your account details
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form id="sign-in" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="john10@gmail.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="key"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="key">
                    Key
                  </FieldLabel>
                  <Input
                    {...field}
                    id="key"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
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
          <Button type="submit" form="sign-in">
            Sign in
          </Button>
          <div className="flex flex-row gap-1 justify-center text-sm text-muted-foreground">
            <span>Don’t have an account?</span>
            <Link href="/sign-up" className="underline 
            font-extrabold hover:underline">
              Sign up
            </Link>
          </div>

        </Field>
      </CardFooter>
    </Card>
  )
}
