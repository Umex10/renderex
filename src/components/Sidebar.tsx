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
import { LogOut, Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase/config"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation";
import { AppDispatch } from "../../redux/store"
import { NotesArgs } from "../types/notesArgs";
import { useDispatch } from "react-redux"
import { Badge } from "./ui/badge"
import DialogForm from "./DialogForm"
import { useNotes } from "@/hooks/use-notes";
import { setActiveNote } from "../../redux/slices/notesSlice";

/**
 * Args for the AppSidebar component.
 * @interface AppSidebarArgs
 * @property {NotesArgs[]} initialNotes - The initial list of notes to be displayed in the sidebar.
 */
interface AppSidebarArgs {
  initialNotes: NotesArgs[];
}

/**
 * The main sidebar component for the application.
 * Displays a list of notes, allows creating new notes, and handles navigation.
 * Uses the `useNotes` hook to manage note state and interactions.
 * 
 * @component
 * @param {AppSidebarArgs} args - The component arguments.
 * @returns {JSX.Element} The AppSidebar component.
 */
export function AppSidebar({ initialNotes }: AppSidebarArgs) {

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { notes, loading, handleNew, handleDelete, handleEdit } = useNotes(initialNotes);

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
          <SidebarGroupLabel className="border-b border-black rounded-none">
            <DialogForm edit={false} onAction={handleNew}></DialogForm>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4 mt-6">

              {loading && notes.length === 0 && (
                <h2>Loading your notes...</h2>
              )}

              {notes && notes.map(note => (
                <Card key={note.id} className="flex flex-col gap-2 py-2 hover:scale-105
                transform-all ease-out duration-300"
                  onClick={() => {
                    dispatch(setActiveNote(note.id));
                  }}>
                  <CardHeader className="px-4 py-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="leading-tight">
                        {note.title}
                      </CardTitle>
                      <div className="flex justify-center items-center gap-1"
                      onClick={(e) => e.stopPropagation()}>
                        <DialogForm edit={true} noteId={note.id}
                          onAction={handleEdit}></DialogForm>
                        <Button variant="secondary" className="w-8 h-8 p-0
                      hover:scale-105"
                          onClick={(e) => {
                            handleDelete(e, note.id);
                          }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent className="px-4 py-0 flex gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag.charAt(0).toUpperCase() +
                        tag.slice(1,)}</Badge>
                    ))}
                  </CardContent>
                  <CardFooter className="px-4 py-0">
                    <span className="text-xs text-gray-400">Last edited: <span>
                      {note.date}</span></span>
                  </CardFooter>
                </Card>
              ))}
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
