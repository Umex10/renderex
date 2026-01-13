"use client"
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { setFormatState } from '../../../redux/slices/formatSlice';
import { FORMAT } from '../../../constants/Format';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { NotesArgs } from '@/types/notesArgs';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useFormat } from '@/hooks/format/use-format';

const SelectFormat = () => {

  const [format, setFormat] = useState<string>(FORMAT.MD);
  const activeNote = useSelector((state: RootState) => state.notesState.activeNote);
  const [note, setNote] = useState<NotesArgs | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {handleDownload} = useFormat();

  useEffect(() => {
    dispatch(setFormatState(format));
  }, [format])


  useEffect(() => {

    if (!activeNote) return;

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

    })
    return () => unsubscribe();
  }, [activeNote])

  if (!note) {
    return <p className='hidden md:block'>Select a note, so the download Select element is visible</p>
  }

  return (
    <div className='flex flex-row gap-1'>
      <Button onClick={() => handleDownload(note)}>
        <span>Download</span>
        <Download></Download>
      </Button>
      <Select defaultValue={FORMAT.MD} value={format} onValueChange={setFormat}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select a format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FORMAT.MD}>.md</SelectItem>
          <SelectItem value={FORMAT.DOCX}>.docx</SelectItem>
          <SelectItem value={FORMAT.PDF}>.pdf</SelectItem>
          <SelectItem value={FORMAT.TXT}>.txt</SelectItem>
        </SelectContent>
      </Select>
    </div>

  )
}

export default SelectFormat
