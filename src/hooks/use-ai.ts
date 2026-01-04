"use client"

import { aiDo } from "@/actions/ai";
import { AI_STATE } from "../../constants/loadingStates/AiState";

interface UseAiArgs {
  setAiState: React.Dispatch<React.SetStateAction<typeof AI_STATE[keyof typeof AI_STATE]>>,
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export const useAi = ({setAiState, setContent}: UseAiArgs) => {

  const handleSummarize = async (content: string) => {

    setAiState("generating");

    const res = await aiDo(`Summarize the following markdown content: ${content}`)

    if (!res){ console.error("There was a error with ai")
      setAiState("error");
      return;
    };
    setContent(res);

    setAiState("finished");

    setTimeout(() => setAiState("idle"), 1500);
  }

   const handleStructure = async (content: string) => {
    setAiState("generating");

    const res = 
    await aiDo(`Restructure the following markdown content for better clarity and readability: ${content}`);

    if (!res){ console.error("There was a error with ai")
      setAiState("error");
      return;
    };
    setContent(res);

    setAiState("finished");

    setTimeout(() => setAiState("idle"), 1500);
  }

  return {handleSummarize, handleStructure};

}