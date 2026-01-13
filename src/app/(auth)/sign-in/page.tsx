"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from "@/lib/firebase/config"
import { useRouter } from 'next/navigation';

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
import Link from "next/link"
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from "react"
import Logo from "@/components/layout/Logo"

const formSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address"),

    key: z
      .string()
      .min(6, "Key must be at least 6 characters.")
  });

/**
 * Sign-in page that authenticates a user with email and password
 * using Firebase Authentication and redirects to the dashboard on success.
 */
export default function SignIn() {

  const [signInUser, newUser, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const [user, loadingUser] = useAuthState(auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      key: "",
    },
  })

  useEffect(() => {
    if (!loadingUser && user) {
      router.replace("/dashboard")
    }
  }, [user, loadingUser, router])

  if (loadingUser) {
    return <div>Checking if logged in...</div>
  }

  if (user) {
    return null // oder Loader
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
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
    });

    try {
      const res = await signInUser(data.email, data.key);
      if (res) {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error(err);
    } finally {
      form.reset();
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="flex flex-col items-center gap-4">
        <Logo classnames="w-60 h-14"></Logo>
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
          <Button type="submit" form="sign-in" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {error.message}
            </p>
          )}
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
