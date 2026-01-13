"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LiveRenderer from '@/components/notes/LiveRenderer';
import EditorActions from '@/components/notes/EditorActions';
import { useNote } from '@/hooks/notes/use-note';
import { use } from "react";

const Note = ({
  params
}: {
  params: Promise<{ noteId: string }> 
}) => {
  const unwrappedParams = use(params);
  const noteId = unwrappedParams.noteId;

  const {note, saveState, content, setContent,
    summaryActive, structureActive, handleSummarizeSelection, 
    handleStructureSelection, handleGenerate
  } = useNote(noteId);

  if (!note) {
    return <h2>Loading note...</h2>
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
          summaryActive={summaryActive} structureActive={structureActive}
          handleSummarizeSelection={handleSummarizeSelection}
          handleStructureSelection={handleStructureSelection}
          handleGenerate={handleGenerate}
          ></EditorActions>

        {/* LIVE */}
        <LiveRenderer classes="max-w-none h-[650px]" content={content}></LiveRenderer>
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
            <EditorActions  content={content} setContent={setContent}
              saveState={saveState}
               summaryActive={summaryActive}
              structureActive={structureActive}
              handleSummarizeSelection={handleSummarizeSelection}
              handleStructureSelection={handleStructureSelection}
              handleGenerate={handleGenerate}></EditorActions>

          </TabsContent>
          {/* LIVE VIEW */}
          <TabsContent value="live">
            <LiveRenderer classes="max-w-none h-[650px]" content={content}></LiveRenderer>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}

export default Note
