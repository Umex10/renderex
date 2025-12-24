"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from "@/lib/firebase/config"
import { db } from "@/lib/firebase/config"

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
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Logo from "@/components/Logo"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

const formSchema = z
  .object({
    username: z
      .string()
      .min(5, "Username must be at least 5 characters.")
      .max(32, "Username must be at most 32 characters."),

    email: z
      .string()
      .email("Invalid email address")
      .max(100, "Email must be at most 100 characters."),

    key: z
      .string()
      .min(8, "Key must be at least 8 characters.")
      .max(64, "Key must be at most 64 characters."),

    confirmKey: z.string(),
  })
  
  //Zod will check for us if there are the same
  .refine((data) => data.key === data.confirmKey, {
    message: "Keys do not match.",
    path: ["confirmKey"],
  });

/**
* Sign-up page that creates a new user with email and password
* using Firebase Authentication and redirects to the dashboard on success.
*/
export default function SignUp() {

  const [createUser, newUser, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const [user, loadingUser] = useAuthState(auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      key: "",
      confirmKey: ""
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

  /**
   * Handles the sign-up form submission.
   *
   * @param data Validated form values including username, email, key and confirmKey.
   */
  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
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
      const res = await createUser(data.email, data.key);
      if (!res?.user) {
        throw new Error("User creation failed...")
      }

        const firebaseUser = res.user;

        await setDoc(doc(db, "users", firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: data.username,
          role: "user",
          createdAt: serverTimestamp()
        })

         router.push("/dashboard")
  
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
        <form id="sign-up" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder="john10"
                    autoComplete="off"
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
            <Controller
              name="confirmKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmKey">
                    Confirm key
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmKey"
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
          
          <Button type="submit" form="sign-up" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {error.message}
            </p>
          )}
          <div className="flex flex-row gap-1 justify-center text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Link href="/sign-in" className="underline
            font-extrabold  hover:underline">
              Sign in
            </Link>
          </div>
        </Field>
      </CardFooter>
    </Card>
  )
}
