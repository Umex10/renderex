"use server"

import { NotesArgs } from "@/types/notesArgs"
import { renderToBuffer } from "@react-pdf/renderer";
import { Packer, Document, Paragraph, TextRun } from "docx";
import { remark } from 'remark';
import strip from 'strip-markdown';
import { MyPdf } from '@/utils/Pdf';
import React from "react";

export async function getDOCX(note: NotesArgs) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: note.title, bold: true, size: 32 })],
        }),
        ...note.content.split("\n").map(line => new Paragraph({
          children: [new TextRun({ text: line })],
        })),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  

  return new Uint8Array(buffer);
}



export async function getPDF(note: NotesArgs) {
  try {
    // Rendert die React-Komponente direkt in einen Buffer
   const element = React.createElement(MyPdf, { 
      title: note.title, 
      content: note.content 
    });

    const buffer = await renderToBuffer(element);

    // Rückgabe als Uint8Array für die Netzwerkübertragung
    return new Uint8Array(buffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("PDF konnte nicht erstellt werden");
  }
}


export async function getTXT(note: NotesArgs) {

  const file = await remark()
    .use(strip)
    .process(note.content);

  const plainText = String(file);

  return `${note.title.toUpperCase()}\n\n${plainText}`;
}