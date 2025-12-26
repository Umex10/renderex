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
import { auth, db } from "@/lib/firebase/config"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation";

import { AppDispatch } from "../../redux/store"
import { NotesArgs, setActiveNote } from "../../redux/slices/notesSlice"
import { useDispatch } from "react-redux"
import { Badge } from "./ui/badge"
import DialogForm from "./DialogForm"
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { createNote, deleteNote, editNote } from "@/actions/notes";

interface AppSidebarArgs {
  initialNotes: NotesArgs[];
}


export function AppSidebar({ initialNotes }: AppSidebarArgs) {

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [notes, setNotes] = useState<NotesArgs[]>(initialNotes)
  const [user, loading] = useAuthState(auth);

  useEffect(() => {

    if (loading || !user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const notesData = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<NotesArgs, "id">)
      }));
      setNotes(notesData)
    },
      (error) => {
        console.error("Firestore error while catching all notes: ", error);
      })

    return () => unsubscribe()
  }, [user, loading])

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {

    e.stopPropagation();

    const oldNotes = [...notes];
    setNotes(old => old.filter(note => note.id !== noteId));

    try {
      const result = await deleteNote(noteId);

      if (!result.success) {
        setNotes(oldNotes);
      }

    } catch (err) {
      console.error("An error occured while deleting the note: ", err);
    }
  }

  const handleNew = async (data: { title: string, tags: string[] }) => {

    if (!user) {
      throw new Error("User was not defined while handling new Note inside Sidebar");
    }

    // set newNote with a fake id which we will change later
    const customId = crypto.randomUUID();

    const newNote = {
      id: customId,
      title: data.title,
      content: "",
      date: new Date().toISOString(),
      tags: data.tags,
      userId: user.uid
    }

    const oldNotes = [...notes];
    setNotes(old => [...old, newNote]);

    try {
      const result = await createNote(newNote);

      if (!result.success) {
        setNotes(oldNotes);
      }

      if (result && result.id) {

        // Change id to the id which was given by firebase 
        setNotes(old => old.map(note => 
          note.id === result.id ? {...note, id: result.id} : note
        ))
        dispatch(setActiveNote(result.id))
      }

    } catch (err) {
      console.error("An error occured while calling createNote server action: ", err);
    }
  }

  const handleEdit = async (data: { title: string, content: string, tags: string[] },
    noteId: string
  ) => {

    const newNote = {
      title: data.title,
      content: data.content,
      date: new Date().toISOString(),
      tags: data.tags,
    }

    const oldNotes = [...notes];
    setNotes(old =>
      old.map(note =>
        note.id === noteId ? { ...note, ...newNote } : note
      )
    );

    try {
      const result = await editNote(noteId, newNote);

      if (!result.success) {
        setNotes(oldNotes);
      }

    } catch (err) {
      console.error("An error occured while calling editNote server action: ", err);
    }
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
          <SidebarGroupLabel className="border-b border-black rounded-none">
            <DialogForm edit={false} onActionNew={handleNew}></DialogForm>
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
                      <div className="flex justify-center items-center gap-1">
                        <DialogForm edit={true} noteId={note.id}
                          onActionEdit={handleEdit}></DialogForm>
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
