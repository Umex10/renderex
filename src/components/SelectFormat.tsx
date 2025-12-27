"use client"
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { setFormatState } from '../../redux/slices/formatSlice';
import { FORMAT } from '../../constants/Format';

const SelectFormat = () => {

  const [format, setFormat] = useState<string>(FORMAT.MD);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setFormatState(format));
  }, [format])

  return (
    <Select defaultValue={FORMAT.MD} value={format ?? undefined} onValueChange={setFormat}>
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
  )
}

export default SelectFormat
