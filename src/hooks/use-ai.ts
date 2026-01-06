"use client"

import { aiDo } from "@/actions/ai";
import { AI_STATE } from "../../constants/loadingStates/AiState";

interface UseAiArgs {
  setAiState: React.Dispatch<React.SetStateAction<typeof AI_STATE[keyof typeof AI_STATE]>>
}

export const useAi = ({ setAiState }: UseAiArgs) => {

  const handleSummarize = async (content: string, activeMode: string) => {

    setAiState("generating");

    const res = await aiDo(`
    Summarize the following markdown content into a concise, well-structured note based on the mode.

    Rules:
    - Only output the summarized content.
    - Do NOT explain your reasoning.
    - Do NOT mention why something was summarized.
    - Preserve the original meaning and necessary details.
    - Remove repetition, examples, and unnecessary wording.
    - Use clear sentences or bullet points where appropriate.
    - Keep the result short, focused, and easy to read.
    - Maintain markdown formatting if useful.

    Modes:
    - summary-replace: Replace the entire note with the summary. Output should be a complete new note.
    - summary-insert-start: Generate a summary and insert it at the beginning of the note. Do not remove the original content.
    - summary-insert-bottom: Generate a summary and insert it at the end of the note. Do not remove the original content.

    Mode: ${activeMode}
    Markdown content:
    ${content}
`);

    if (!res) {
      console.error("There was a error with ai")
      setAiState("error");
      return;
    };


    setAiState("finished");

    setTimeout(() => setAiState("idle"), 1500);

    return res;
  }

  const handleStructure = async (content: string, activeMode: string) => {
    setAiState("generating");

    const res = await aiDo(`
    Restructure the following markdown content to improve clarity, organization, and readability.

    Rules:
    - Output ONLY the restructured content.
    - Do NOT explain your changes.
    - Do NOT add commentary or meta text.
    - Do NOT remove necessary information.
    - Reorganize the content logically.
    - Use clear headings, subheadings, and bullet points where appropriate.
    - Split long paragraphs into smaller, readable sections.
    - Keep the content in markdown format.
    - Do NOT summarize or shorten unless absolutely necessary for clarity.

    Modes:
    - structure-replace: Replace the entire note with a fully restructured version. Original content may be reorganized completely for clarity.
    - structure-enhance: Improve structure, readability, and formatting, but **do not remove or replace original content**. Output should be added alongside or integrated into the existing note.

    Mode: ${activeMode}
    Markdown content:
    ${content}
`);

    if (!res) {
      console.error("There was a error with ai")
      setAiState("error");
      return;
    };

    setAiState("finished");

    setTimeout(() => setAiState("idle"), 1500);
    return res;
  }

  return { handleSummarize, handleStructure };

}