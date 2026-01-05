"use client"

import Editor from '@/components/Editor';
import { Button } from './ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { AI_STATE } from '../../constants/loadingStates/AiState';
import { CONTENT_STATE } from '../../constants/loadingStates/ContentState';
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface EditorActionsArgs {
  content: string,
  setContent: (content: string) => void,
  saveState: string,
  aiState: string,
  summaryActive: boolean,
  structureActive: boolean,
  handleSummarizeSelection: (value: string) => void;
  handleStructureSelection: (value: string) => void;
  handleGenerate: () => void;
}

const EditorActions = (data: EditorActionsArgs) => {

  const { content, setContent, saveState,
    aiState, summaryActive, structureActive,
    handleSummarizeSelection, handleStructureSelection,handleGenerate
  } = data;


  return (
    <div className='min-w-0'>
      <Editor
        value={content}
        onChange={(val) => setContent(val)}
      />

      {/* SELECT + BUTTONS | SAVE/GENERATE STATE */}
      <div className='flex justify-center md:justify-between items-start mt-2'>

         {/* SELECTIONS + RESET SELECTION | GENERATE CONTAINER */}
        <div className='flex flex-col items-center
        md:items-start gap-2'>

          {/* SELECTIONS + RESET SELECTION */}
          <div className='flex flex-row gap-3'>

  
              {/* Summarize */}
              <Select
                defaultValue="summarize-replace"
                onValueChange={(value) => handleSummarizeSelection(value)}
              >
                <SelectTrigger
                  className={`px-1 border-2 ${summaryActive
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-400 bg-white opacity-50"
                    }`}
                >
                  <span className='px-2'>AI Summary</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summarize-replace" className="md:text-lg">
                    Change entire note
                  </SelectItem>
                  <SelectItem value="summarize-insert-start" className="md:text-lg">
                    Insert summary at start
                  </SelectItem>
                  <SelectItem value="summarize-insert-bottom" className="md:text-lg">
                    Insert summary at bottom
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Structure */}
              <Select
                onValueChange={(value) => handleStructureSelection(value)}
              >
                <SelectTrigger
                  className={`px-1 border-2 ${structureActive
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-400 bg-white opacity-50"
                    }`}
                >
                  <span className='px-2'>AI Structure</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="structure-replace" className="md:text-lg">
                    Change entire note
                  </SelectItem>
                  <SelectItem value="structure-enhance" className="md:text-lg">
                    Enhance structure
                  </SelectItem>
                </SelectContent>
              </Select>
          </div>
          <Button onClick={() => handleGenerate()}>
            {`Generate ${summaryActive ? "Summary" : "Structure"}`}
          </Button>
        </div>

        {/* SAVING | GENERATING STATES */}
        <div className='flex flex-row gap-4 mt-2'>
          {/* SAVING STATES */}
          <div className={`${saveState === CONTENT_STATE.IDLE ? "hidden" : ""}`}>
            {saveState === CONTENT_STATE.SAVING && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Content</span>
              </div>
            )}

            {saveState === CONTENT_STATE.SAVED && (
              <div className="w-full flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Saved content</span>
              </div>
            )}

            {saveState === CONTENT_STATE.ERROR && (
              <span className="text-red-600">Content save failed</span>
            )}
          </div>

          {/* GENERATE STATES */}
          <div className={`${aiState === AI_STATE.IDLE ? "hidden" : ""}`}>
            {aiState === AI_STATE.GENERATING && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is generating</span>
              </div>

            )}

            {aiState === AI_STATE.FINISHED && (
              <div className="w-full flex items-center gap-1 text-green-600 flex-nowrap">
                <CheckCircle className="h-4 w-4" />
                <span>AI Finished Generating</span>
              </div>
            )}

            {aiState === AI_STATE.ERROR && (
              <span className="text-red-600">AI Generation failed</span>
            )}
          </div>

        </div>


      </div>
    </div>
  )
}

export default EditorActions
