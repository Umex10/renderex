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
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { NotesArgs } from '../../../redux/slices/notesSlice';

/**
 * Protected dashboard page.
 * Redirects unauthenticated users to the sign-in page and
 * shows a loading state while Firebase auth is initializing.
 */
const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [content, setContent] = useState("");

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
      {/* HEADER */}
      <Tabs defaultValue="markdown" className="w-full flex flex-col">
        {/* ABOVE TEXT LEFT + TABS LIST RIGHT) */}
        <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-center md:items-end">


          <div className="w-full flex items-center gap-2 text-3xl">
            <h2 className="font-bold">{note.title}</h2>
          </div>

          {/* TabsList stays on the right and aligned with the header */}
          <TabsList className="grid grid-cols-2 w-full md:w-auto max-w-[250px]">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
          </TabsList>
        </div>

        {/* CONTENT SECTION */}
        <div className="w-full mt-4">
          <TabsContent value="markdown" >
            <Textarea className='min-h-[400px]'
              value={content} onChange={e =>
                setContent(e.target.value)}></Textarea>
          </TabsContent>
          <TabsContent value="live">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content || "*Nothing to show yet...*"}
              </ReactMarkdown>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Dashboard
