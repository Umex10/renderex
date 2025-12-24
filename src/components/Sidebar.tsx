"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Logo from "./Logo"
import Link from "next/link";
import { LogOut } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import Image from "next/image";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase/config"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation";
import { Plus } from 'lucide-react';
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "./ui/field"


const formSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters."),

    tags: z
      .array(z.string()).min(1, "Add at least one tag")

  })

export function AppSidebar() {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      tags: []
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {

    console.log({
      title: data.title,
      tags: data.tags
    })

    form.reset()
  }

  return (
    <Sidebar className="hidden lg:flex">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" onClick={() => router.push("/")}>
          <Logo classnames="w-40 h-10"></Logo>
        </Link>

        <SidebarTrigger className="lg:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Dialog>
              <DialogTrigger asChild onClick={() => form.reset()}>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">Notes</span>
                  <Button variant="default" className="w-6 h-7">
                    <Plus />
                  </Button>
                </div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <form id="create-note" onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Add a new Note</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <Controller
                      name="title"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="title">Title</FieldLabel>
                          <Input
                            {...field}
                            id="title"
                            placeholder="Title"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid &&
                            <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="tags"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="tags">Tags</FieldLabel>
                          <Input
                            {...field}
                            id="tags"
                            placeholder="Java, draw"
                            onChange={e =>
                              field.onChange(
                                e.target.value
                                  .split(",")
                                  .map(tag => tag.trim())
                                  .filter(t => t)
                              )
                            }
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid &&
                            <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="create-note">Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>

            </Dialog>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4 items-center">
        <Card className="w-full flex flex-row items-center justify-start
           gap-2 px-4 py-4">

          <CardHeader className="p-0">
            <Image
              src="/globe.svg"
              alt='Vercel'
              width={30}
              height={30}
              loading='eager'
            >
            </Image>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-start p-0">
            <span className="text-sm font-bold">shadcn</span>
            <span className="text-xs">s@wasgeht.at</span>
          </CardContent>
        </Card>
        <Button className="w-full hover:bg-red-500"
          onClick={() => signOut(auth)}>
          <LogOut></LogOut>
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}