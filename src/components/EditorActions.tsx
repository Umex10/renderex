"use client"

import React from 'react'

import Editor from '@/components/Editor';
import { Button } from './ui/button';
import { CheckCircle, Download, FileText, ListTree } from 'lucide-react';
import { NotesArgs } from '@/types/notesArgs';
import { AI_STATE } from '../../constants/loadingStates/AiState';
import { CONTENT_STATE } from '../../constants/loadingStates/ContentState';


interface EditorActionsArgs {
  content: string,
  setContent: (content: string) => void,
  saveState: string,
  handleDownload: (note: NotesArgs) => void,
  note: NotesArgs,
  aiState: string,
  handleSummarize: (content: string) => void;
  handleStructure: (content: string) => void;
}

const EditorActions = (data: EditorActionsArgs) => {

  const { content, setContent, saveState, handleDownload, note,
    aiState, handleSummarize, handleStructure
  } = data;

  return (
    <div className='min-w-0'>
      <Editor
        value={content}
        onChange={(val) => setContent(val)}
      />

      <div className='flex justify-between items-center'>
        <div className='flex flex-row gap-3'>
          <Button className='mt-2' onClick={() => handleDownload(note)}>
            <span>Download</span>
            <Download></Download>
          </Button>
          <Button className='mt-2' onClick={() => handleSummarize(content)}>
            <span>Summarize</span>
            <FileText></FileText>
          </Button>
          <Button className='mt-2' onClick={() => handleStructure(content)}>
            <span>Structure</span>
            <ListTree></ListTree>
          </Button>
        </div>

        <div className='flex flex-row gap-1'>
          <div className={`${saveState === CONTENT_STATE.IDLE ? "hidden" : ""}`}>
            {saveState === CONTENT_STATE.SAVING && (
              <span className="text-muted-foreground">Saving Content…</span>
            )}

            {saveState === CONTENT_STATE.SAVED && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Saved Content
              </span>
            )}

            {saveState === CONTENT_STATE.ERROR && (
              <span className="text-red-600">Content save failed</span>
            )}
          </div>

          <div className={`${aiState === AI_STATE.IDLE ? "hidden" : ""} flex-nowrap`}>
            {aiState === AI_STATE.GENERATING && (
              <span className="text-muted-foreground">AI is generating...</span>
            )}

            {aiState === AI_STATE.FINISHED && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                AI Finished Generating...
              </span>
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
