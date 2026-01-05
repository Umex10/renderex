"use client"

import React, { use, useEffect, useRef, useState } from 'react'
import { db } from "@/lib/firebase/config"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { NotesArgs } from "../../../../types/notesArgs";
import LiveRenderer from '@/components/LiveRenderer';
import EditorActions from '@/components/EditorActions';
import { CONTENT_STATE } from '../../../../../constants/loadingStates/ContentState';
import { AI_STATE } from '../../../../../constants/loadingStates/AiState';
import { useAi } from '@/hooks/use-ai';

const Note = ({
  params
}: {
  params: Promise<{ noteId: string }> // 2. Ändere den Typ zu Promise
}) => {
  // 3. Nutze React.use(), um die ID zu extrahieren
  const unwrappedParams = use(params);
  const noteId = unwrappedParams.noteId;

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

  const { handleSummarize, handleStructure } = useAi({ setAiState, setContent });

  const [summaryActive, setSummaryActive] = useState(true);
  const [structureActive, setStructureAtive] = useState(false);

  const startMode = "summarize-replace"

  const [activeMode, setActiveMode] = useState(startMode);

  function handleSummarizeSelection(value: string) {
    setSummaryActive(true);
    setStructureAtive(false);

    setActiveMode(value);
  }

  function handleStructureSelection(value: string) {
    setStructureAtive(true);
    setSummaryActive(false);

    setActiveMode(value);
  }

  function handleGenerate() {
    if (summaryActive) {
      handleSummarize(content, activeMode);
    } else {
      handleStructure(content, activeMode)
    }
  }

  useEffect(() => {

    const noteRef = doc(db, "notes", noteId);

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
  }, [noteId])

  useEffect(() => {
    if (!note || !content || aiState !== "idle") return;

    // if the content is the same as before, than ignore
    if (content === lastSavedContent.current) return;

    // This will ensure we don't fetch the notes unnecessarily on the first load
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
  }, [content, note, aiState])

  if (!note) {
    return <h2>The note does not exist</h2>
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
          saveState={saveState}
          aiState={aiState} summaryActive={summaryActive}
          structureActive={structureActive}
          handleSummarizeSelection={handleSummarizeSelection}
          handleStructureSelection={handleStructureSelection}
          handleGenerate={handleGenerate}></EditorActions>

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


            {/* EDITOR */}
            <EditorActions content={content} setContent={setContent}
              saveState={saveState}
              aiState={aiState} summaryActive={summaryActive}
              structureActive={structureActive}
              handleSummarizeSelection={handleSummarizeSelection}
              handleStructureSelection={handleStructureSelection}
              handleGenerate={handleGenerate}></EditorActions>

          </TabsContent>
          {/* LIVE VIEW */}
          <TabsContent value="live">
            <LiveRenderer content={content}></LiveRenderer>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}

export default Note
