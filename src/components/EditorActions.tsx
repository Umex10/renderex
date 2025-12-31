"use client"

import React from 'react'

import Editor from '@/components/Editor';
import { Button } from './ui/button';
import { CheckCircle, Download } from 'lucide-react';
import { NotesArgs } from '@/types/notesArgs';

interface EditorActionsArgs {
  content: string,
  setContent: (content: string) => void,
  saveState: string,
  handleDownload: (note: NotesArgs) => void,
  note: NotesArgs
}

const EditorActions = (data: EditorActionsArgs) => {

  const {content, setContent, saveState, handleDownload, note} = data;

  return (
    <div className='min-w-0'>
          <Editor
            value={content}
            onChange={(val) => setContent(val)}
          />

          <div className='flex justify-between items-center'>
            <Button className='mt-2' onClick={() => handleDownload(note)}>
              <span>Download</span>
              <Download></Download>
            </Button>
            {saveState === "saving" && (
              <span className="text-muted-foreground">Saving…</span>
            )}

            {saveState === "saved" && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Saved
              </span>
            )}

            {saveState === "error" && (
              <span className="text-red-600">Save failed</span>
            )}
          </div>
        </div>
  )
}

export default EditorActions
