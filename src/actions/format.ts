"use server"

import { NotesArgs } from "@/types/notesArgs"
import { renderToBuffer } from "@react-pdf/renderer";
import { Packer, Document, Paragraph, TextRun } from "docx";
import { remark } from 'remark';
import strip from 'strip-markdown';
import { MyPdf } from '@/utils/download/Pdf';
import React from "react";

/**
 * Generates a DOCX file from a note.
 *
 * @param note - The note data to convert.
 * @returns The generated DOCX as a Uint8Array.
 */

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



/**
 * Generates a PDF file from a note.
 *
 * @param note - The note data to convert.
 * @returns The generated PDF as a Uint8Array.
 * @throws If the PDF generation fails.
 */
export async function getPDF(note: NotesArgs) {
  try {
    const element = React.createElement(MyPdf, {
      title: note.title, 
      content: note.content 
    });

    const buffer = await renderToBuffer(element);

    return new Uint8Array(buffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF.");
  }
}


/**
 * Converts a note's Markdown content to plain text (title + body).
 *
 * @param note - The note data to convert.
 * @returns A plain-text string.
 */
export async function getTXT(note: NotesArgs) {

  const file = await remark()
    .use(strip)
    .process(note.content);

  const plainText = String(file);

  return `${note.title.toUpperCase()}\n\n${plainText}`;
}