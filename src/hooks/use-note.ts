"use client"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setActiveNote } from "../../redux/slices/notesSlice";
import { useEffect, useRef, useState } from "react";
import { CONTENT_STATE } from "../../constants/loadingStates/ContentState";
import { useAi } from "./use-ai";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { NotesArgs } from "@/types/notesArgs";
import { setShowSandbox, setSandboxContent, setIsSandboxActive, setIsTryAgainActive, setIsTransferActive, addToSandboxHistory }
  from "../../redux/slices/sandboxSlice";

export const useNote = (noteId: string) => {

  const activeNote = useSelector((state: RootState) => state.notesState.activeNote);

  const dispatch = useDispatch<AppDispatch>();

 useEffect(() => {
    if (activeNote !== noteId) {
    dispatch(setActiveNote(noteId));
  }
  }, [activeNote, noteId])

    const [note, setNote] = useState<NotesArgs | null>(null);
    const [content, setContent] = useState<string>(note?.content || "");

    // Ensures that content isn't rewritten uneccessarily onto firebase
    const lastSavedContent = useRef(note?.content || "")

    // This will ensure, that we will not load the globalTags uneccessarily since 
    // we are getting it from the server 
    const firstLoad = useRef(true);

    // Will set states based on the markdown content of the note
    const [saveState, setSaveState] = useState<
      typeof CONTENT_STATE[keyof typeof CONTENT_STATE]
    >(CONTENT_STATE.IDLE);

    // Will set states based on the ai generation for the note
    const aiState = useSelector((state: RootState) => state.aiState.status);

    const { handleSummarize, handleStructure } = useAi();

    const [summaryActive, setSummaryActive] = useState(true);
    const [structureActive, setStructureAtive] = useState(false);

    const startMode = "summarize-replace"

    const [activeMode, setActiveMode] = useState(startMode);

    const { isTryAgainActive, sandboxContent,
      isTransferActive
    } = useSelector((state: RootState) => state.sandboxState);

    function handleSummarizeSelection(value: string) {
      setSummaryActive(true);
      setStructureAtive(false);

      setActiveMode(value);

      if (value !== "summarize-sandbox") {
        dispatch(setIsSandboxActive(false));
      }

      if (value === "summarize-sandbox") {
        dispatch(setIsSandboxActive(true));
      }
    }

    function handleStructureSelection(value: string) {
      setStructureAtive(true);
      setSummaryActive(false);

      setActiveMode(value);

      if (value !== "structure-sandbox") {
        dispatch(setIsSandboxActive(false));
      }

      if (value === "structure-sandbox") {
        dispatch(setIsSandboxActive(true));
      }
    }

    async function handleGenerate() {
      let res;
      const isSandboxActive = activeMode === "summarize-sandbox" || activeMode === "structure-sandbox"

      if (isSandboxActive) dispatch(setShowSandbox(true));

      if (summaryActive) {
        res = await handleSummarize(content, activeMode, isTryAgainActive, sandboxContent);
      } else {
        res = await handleStructure(content, activeMode, isTryAgainActive, sandboxContent)
      }

      if (!res) return;

      if (isSandboxActive) {
        dispatch(setSandboxContent(res));
        dispatch(addToSandboxHistory(res));
      } else {
        setContent(res);
      }
    }

    useEffect(() => {
      async function generateAgain() {
        if (isTryAgainActive) {
          await handleGenerate();

          // to ensure that this is not always active
          dispatch(setIsTryAgainActive(false));
        }
      }

      generateAgain();
    }, [isTryAgainActive])

    useEffect(() => {
      function transfer() {
        if (isTransferActive) {
          setContent(sandboxContent);
          dispatch(setIsTransferActive(false));
        }
      }

      transfer();
    }, [isTransferActive])

    useEffect(() => {

      const noteRef = doc(db, "notes", noteId);

      // This will fetch new newest data from firebase, if something changed 
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

        // Enables the markdown editor with the content
        setContent(noteData.content);

      })
      return () => unsubscribe();
    }, [noteId])

    useEffect(() => {
      if (!note || !content || aiState !== "idle") return;

      // if the content is the same as before, than ignore
      if (content === lastSavedContent.current) return;

      // This will ensure we don't fetch the notes unnecessarily on the first load
      if (firstLoad.current) {
        firstLoad.current = false;
        return;
      }

      setTimeout(() => setSaveState("saving"), 0);

      // Ensures that after 5 seconds the current content is written onto firebase
      const handler = setTimeout(async () => {
        try {
          const noteRef = doc(db, "notes", note.id);

          await updateDoc(noteRef, {
            content: content,
            date: new Date().toISOString()
          });
          lastSavedContent.current = content;

          setSaveState("saved");

          setTimeout(() => setSaveState("idle"), 1500);
        } catch (err) {
          console.error("An error occured while editing the content field in firebase: ", err);
        }
      }, 5000)

      return () => clearTimeout(handler);
    }, [content, note, aiState])

    return {
      note, content, setContent, saveState, aiState,
      summaryActive, structureActive, handleSummarizeSelection,
      handleStructureSelection, handleGenerate
    }
  }