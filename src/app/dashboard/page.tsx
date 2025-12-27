"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "@/lib/firebase/config"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { NotesArgs } from "../../types/notesArgs";
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormat } from '@/hooks/use-format';
import Editor from '@/components/Editor';


/**
 * Protected dashboard page component.
 * Displays the main workspace where users can view and edit their notes.
 * Handles authentication checks, real-time note updates, and auto-saving functionality.
 * 
 * Features:
 * - Redirects unauthenticated users to sign-in.
 * - Fetches the active note from Firestore based on Redux state.
 * - Provides a Markdown editor and a Live preview tab.
 * - Auto-saves content changes to Firestore with a debounce delay.
 * 
 * @component
 * @returns {JSX.Element | null} The Dashboard page content or null if redirecting/loading.
 */
const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [content, setContent] = useState("");

  const { handleDownload } = useFormat();

  const activeNote = useSelector((state: RootState) => state.notesState.activeNote);

  const [note, setNote] = useState<NotesArgs | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !activeNote) {
      return;
    }

    const noteRef = doc(db, "notes", activeNote);

    const unsubscribe = onSnapshot(noteRef, snap => {
      if (!snap.exists) {
        return;
      }

      const noteData = {
        id: snap.id,
        ...(snap.data() as Omit<NotesArgs, "id">)
      };

      setNote(noteData);
      setContent(noteData.content);

    })
    return () => unsubscribe();
  }, [user, activeNote])

  useEffect(() => {
    if (!note || !content) return;

    const handler = setTimeout(async () => {
      await updateDoc(doc(db, "notes", note.id), { content });
    }, 1500)

    return () => clearTimeout(handler);
  }, [content, note])

  if (loading) {
    return <div>Loading note...</div>;
  }

  if (!user) {
    return null;
  }

  if (!note) {
    return <h2>Create a note to be able to see the markdown text editor</h2>
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">

       <div className="w-full hidden 2xl:flex items-center gap-2 text-3xl">
            <h2 className="w-full text-center md:text-left font-bold">{note.title}</h2>
      </div>

      <div className='w-full hidden 2xl:flex flex-row gap-2'>
        <div className='w-1/2'>
          <Editor
            value={content}
            onChange={(val) => setContent(val)}
          />

          <Button className='mt-2' onClick={() => handleDownload(note)}>
            <span>Download</span>
            <Download></Download>
          </Button>
        </div>
        <div className="w-1/2 prose prose-slate max-w-none h-[650px] overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content !== "" ? content : "Write something down in order to see it live"}
          </ReactMarkdown>
        </div>
      </div>

      <Tabs defaultValue="markdown" className="2xl:hidden w-full flex flex-col">
       
        <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-center md:items-end">


          <div className="w-full flex items-center gap-2 text-3xl">
            <h2 className="w-full text-center md:text-left font-bold">{note.title}</h2>
          </div>

 
          <TabsList className="grid grid-cols-2 w-full md:w-auto max-w-[250px]">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
          </TabsList>
        </div>


        <div className="w-full mt-4">
          <TabsContent value="markdown" >
            <Editor
            value={content}
            onChange={(val) => setContent(val)}
          />
            <Button className='mt-2' onClick={() => handleDownload(note)}>
              <span>Download</span>
              <Download></Download>
            </Button>
          </TabsContent>
          <TabsContent value="live">
            <div className="prose prose-slate  max-w-none
            min-h-[650px] overflow-y-scroll">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content !== "" ? content : "Write something down in order to see it live"}
              </ReactMarkdown>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}

export default Dashboard
