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

export function AppSidebar() {

  const router = useRouter();

  return (
    <Sidebar  className="hidden lg:flex">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" onClick={() => router.push("/")}>
          <Logo classnames="w-40 h-10"></Logo>
        </Link>

        <SidebarTrigger className="lg:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
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