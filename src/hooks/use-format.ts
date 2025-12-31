"use client"

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FORMAT } from "../../constants/Format";
import { getDOCX, getPDF, getTXT } from "@/actions/format";
import { triggerDownload } from "@/utils/download/triggerDownload";
import { NotesArgs } from "@/types/notesArgs";
import { sanitize } from "@/utils/download/sanitize";

export function useFormat() {

  const format = useSelector((state: RootState) => state.formState.format);

  // This will decide which file will be downloaded
  const handleDownload = async (note: NotesArgs) => {
    const fileName = sanitize(note.title);

    switch (format) {
      case FORMAT.MD:
        triggerDownload(note.content, `${fileName}.md`, "text/markdown");
        break;
      case FORMAT.DOCX:

        const buffer = await getDOCX(note);

        triggerDownload(
          buffer,
          `${fileName}.docx`,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        break;
      case FORMAT.PDF:
        const pdfBuffer = await getPDF(note);
        triggerDownload(
          pdfBuffer,
          `${fileName}.pdf`,
          "application/pdf"
        );
        break;
      case FORMAT.TXT:
        const txtContent = await getTXT(note);
        triggerDownload(txtContent, `${fileName}.txt`, "text/plain");
        break;
    }
  }


  return { handleDownload };

}

