"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "@/lib/firebase/config"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { NotesArgs } from "../../types/notesArgs";
import { useFormat } from '@/hooks/use-format';
import LiveRenderer from '@/components/LiveRenderer';
import EditorActions from '@/components/EditorActions';
import { CONTENT_STATE } from '../../../constants/loadingStates/ContentState';
import { AI_STATE } from '../../../constants/loadingStates/AiState';
import { useAi } from '@/hooks/use-ai';

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

  const [note, setNote] = useState<NotesArgs | null>(null);
  const [content, setContent] = useState<string>(note?.content || "");
  // Ensures that content isn't rewritten uneccessarily onto firebase
  const lastSavedContent = useRef(note?.content || "")
  const firstLoad = useRef(true);

  const [saveState, setSaveState] = useState<
    typeof CONTENT_STATE[keyof typeof CONTENT_STATE]
  >(CONTENT_STATE.IDLE);

  const [aiState, setAiState] = useState<
    typeof AI_STATE[keyof typeof AI_STATE]>(AI_STATE.IDLE);

  const { handleDownload } = useFormat();
  const { handleSummarize, handleStructure } = useAi({ setAiState, setContent });


  const activeNote = useSelector((state: RootState) => state.notesState.activeNote);

  useEffect(() => {

    // Return the user to sign in if not logged in
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Return if the user hasn't clicked on any note
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

      // initialize state
      setNote(noteData);

      // Enables the markdown editor with the content
      setContent(noteData.content);

    })
    return () => unsubscribe();
  }, [user, activeNote])

  useEffect(() => {
    if (!note || !content) return;

    // if the content is the same as before, than ignore
    if (content === lastSavedContent.current) return;

    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

     setTimeout(() => setSaveState("saving"), 0);

    // Ensures that after 5 seconds the current content is written onto firebase
    const handler = setTimeout(async () => {
      try {
        const noteRef = doc(db, "notes", note.id);

        await updateDoc(noteRef, {
          content: content,
          date: new Date().toISOString()
        });
        lastSavedContent.current = content;

        setSaveState("saved");

        setTimeout(() => setSaveState("idle"), 1500);
      } catch (err) {
        console.error("An error occured while editing the content field in firebase: ", err);
      }
    }, 5000)

    return () => clearTimeout(handler);
  }, [content, note])

  if (loading) {
    return <div>Loading information...</div>;
  }

  if (!user) {
    return null;
  }

  if (!note) {
    return <h2>Create or click a note to see the markdown text editor</h2>
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">

      {/* TITLE */}
      <div className="w-full hidden 2xl:flex items-center gap-2 text-3xl">
        <h2 className="w-full text-center md:text-left font-bold">{note.title}</h2>
      </div>

      {/* EDITOR | LIVE FOR 2XL AND ABOVE */}
      <div className='w-full hidden 2xl:grid grid-cols-2 gap-2'>

        {/* EDITOR */}
        <EditorActions content={content} setContent={setContent}
          saveState={saveState} handleDownload={handleDownload}
          note={note} aiState={aiState} handleSummarize={handleSummarize}
          handleStructure={handleStructure}></EditorActions>

        {/* LIVE */}
        <LiveRenderer content={content}></LiveRenderer>
      </div>

      {/* TABS - MOBILE ONLY */}
      <Tabs defaultValue="markdown" className="2xl:hidden w-full flex flex-col">

        <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-center md:items-end">


          <div className="w-full flex items-center gap-2 text-3xl">
            <h2 className="w-full text-center md:text-left font-bold">{note.title.charAt(0).toUpperCase() + note.title.slice(1,)}</h2>
          </div>


          <TabsList className="grid grid-cols-2 w-full md:w-auto max-w-[250px]">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
          </TabsList>
        </div>


        <div className="w-full mt-4">
          {/* EDITOR VIEW */}
          <TabsContent value="markdown" >

            <EditorActions content={content} setContent={setContent}
              saveState={saveState} handleDownload={handleDownload}
              note={note} aiState={aiState} handleSummarize={handleSummarize}
              handleStructure={handleStructure}></EditorActions>

          </TabsContent>
          {/* LIVE VIEW */}
          <TabsContent value="live">
            <LiveRenderer content={content}></LiveRenderer>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}

export default Dashboard
