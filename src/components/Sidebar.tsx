"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"


import Logo from "./Logo"
import Link from "next/link";
import { ArrowDown, ArrowUp, LogOut, Trash2, X } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase/config"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "../../redux/store"
import { NotesArgs } from "../types/notesArgs";
import { useDispatch, useSelector } from "react-redux"
import { Badge } from "./ui/badge"
import DialogNote from "./DialogNote"
import { useNotes } from "@/hooks/use-notes";
import { setActiveNote } from "../../redux/slices/notesSlice";
import { formatDate } from "@/utils/formatDate";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react"; // useRef & useEffect hinzugefügt
import { Tag, GlobalTags } from "../../redux/slices/tags/tagsSlice";
import TagsInfo from "./TagsInfo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "./ui/multi-select";
import { getRandomHexColor } from "@/utils/getRandomHexColor";
import SingleTag from "./SingleTag";
import { useGlobalTags } from "@/hooks/use-globalTags";
import { useMatchedTags } from "@/hooks/use-matchedTags";

/**
 * Args for the AppSidebar component.
 * @interface AppSidebarArgs
 * @property {NotesArgs[]} initialNotes - The initial list of notes to be displayed in the sidebar.
 */
interface AppSidebarArgs {
  initialNotes: NotesArgs[],
  initialGlobalTags: GlobalTags
}

// Trenner-Komponente für das Resizing
const ResizeHandle = ({ onMouseDown }: { onMouseDown: () => void }) => (
  <div
    className="h-1.5 cursor-row-resize bg-gray-200 hover:bg-violet-400 transition-colors duration-150"
    onMouseDown={onMouseDown}
  />
);

/**
 * The main sidebar component for the application.
 * Displays a list of notes, allows creating new notes, and handles navigation.
 * Uses the `useNotes` hook to manage note state and interactions.
 * * @component
 * @param {AppSidebarArgs} args - The component arguments.
 * @returns {JSX.Element} The AppSidebar component.
 */
export function AppSidebar({ initialNotes, initialGlobalTags }: AppSidebarArgs) {

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [tagInput, setTagInput] = useState("");

  // --- RESIZE LOGIC ---
  const [topHeight, setTopHeight] = useState(425); // start-hight for notes
  const isDragging = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      // Ensures that no section easy below or above 190 height
      setTopHeight((prev) => Math.max(190, prev + e.movementY));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // This will hold the last deleted Global tag, to ensure notes have also deleted that tag
  const [deletedGlobalTag, setDeletedGlobalTag] = useState<Tag | null>(null);

  // NOTES, GLOBAL TAGS HOOKS
  const { notes, loading, handleNew, handleDelete, handleEdit } = useNotes(initialNotes);
  const { handleNewGlobalTag, handleRemoveGlobalTag } = useGlobalTags({initialGlobalTags, setDeletedGlobalTag});

  const globalTags = useSelector((state: RootState) => state.tagsState.tags);

  // SORT STATES
  const [sortAfter, setSortAfter] = useState("date");
  const [isDescending, setIsDescending] = useState(true);
  const [isAscending, setIsAscending] = useState(false);

  // Selected Tags to sort more accurately, if the user selected sort after tags.
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  // Ensures that these objects are sorted, and matched with other states, to ensure the same data
  const {refactoredNotes, sortedGlobalTags} = useMatchedTags({notes, globalTags, handleEdit,
    sortAfter, isDescending, selectedTags, deletedGlobalTag, setDeletedGlobalTag}
  );

  // This will kee track of the selected items, if the user sorts the notes after tags
  const handleSelectionChange = (selected: Tag[]) => {
    setSelectedTags(selected)
  }

  return (
    <Sidebar className="hidden lg:flex">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" onClick={() => router.push("/")}>
          <Logo classnames="w-40 h-10"></Logo>
        </Link>
        <SidebarTrigger className="lg:hidden" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full overflow-hidden">
        
        {/* ADD + | SORT SECTION - Jetzt mit dynamischer Höhe */}
        <div style={{ height: topHeight, minHeight: '190px' }} className="flex flex-col">
          <SidebarGroup className="overflow-y-auto flex-1">
            <SidebarGroupLabel className="border-b border-black rounded-none px-0">
              <span className="text-xl font-bold">Notes</span>
            </SidebarGroupLabel>
              <div
                className="w-full mt-3 md:w-auto flex flex-row justify-between
            items-center md:gap-6"
              >
                {/* ADD + */}
                <DialogNote edit={false} onAction={handleNew} handleNewGlobalTag={handleNewGlobalTag}></DialogNote>

                {/* SORT */}
                <div className="flex flex-row items-center gap-1">

                  <Select
                    defaultValue="date"
                    onValueChange={(value) => setSortAfter(value)}
                  >
                    <SelectTrigger
                      className={`max-w-[70px] px-1 border-2
                    border-gray-400/50`}
                      defaultValue="date"
                    ><SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="date"
                        className="md:text-lg"
                      >
                        Date
                      </SelectItem>
                      <SelectItem
                        value="title"
                        className="md:text-lg"
                      >
                        Title
                      </SelectItem>

                      <SelectItem
                        value="tags"
                        className="md:text-lg"
                      >
                        Tags
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <ArrowDown
                    className={`w-8 h-8 md:w-10 md:h-10
                ${isDescending ? "text-violet-400" : ""} `}
                    onClick={() => {
                      setIsDescending(!isDescending);
                      setIsAscending(!isAscending);
                    }}
                    data-testid="desc"
                  ></ArrowDown>
                  <ArrowUp
                    className={`w-8 h-8  md:w-10 md:h-10
                ${isAscending ? "text-violet-400" : ""} `}
                    onClick={() => {
                      setIsAscending(!isAscending);
                      setIsDescending(!isDescending);
                    }}
                    data-testid="asc"
                  ></ArrowUp>
                </div>
              </div>

              {/* If user sorts the notes after tags, a new UI element will show */}
              {/* to sort more accurately */}
              {sortAfter === "tags" && (
                <div className="mt-2">
                  <MultiSelect
                    items={sortedGlobalTags}
                    selected={selectedTags}
                    onChange={handleSelectionChange}
                    placeholder="Tags..."
                  />
                </div>
              )}

              {/* NOTES SECTION */}
              <div className="flex flex-col gap-4 mt-2">

                {loading && notes.length === 0 && (
                  <h2>Loading your notes...</h2>
                )}

                {refactoredNotes && refactoredNotes.map(note => (
                  <Card key={note.id} className="flex flex-col gap-2 py-2 hover:scale-105
                  transform-all ease-out duration-300 cursor-pointer"
                    onClick={() => {
                      dispatch(setActiveNote(note.id));
                    }}>
                    <CardHeader className="px-4 py-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="leading-tight">
                          {note.title.charAt(0).toUpperCase() + 
                          note.title.slice(1,)}
                        </CardTitle>
                        <div className="flex justify-center items-center gap-1"
                          onClick={(e) => e.stopPropagation()}>
                            {/* EDIT NOTE DIALOG BUTTON */}
                          <DialogNote edit={true} noteId={note.id}
                            onAction={handleEdit} handleNewGlobalTag={handleNewGlobalTag}></DialogNote>
                            {/* DELETE NOTE */}
                          <Button variant="secondary" className="w-8 h-8 p-0
                        hover:scale-105"
                            onClick={(e) => {
                              handleDelete(e, note.id);
                            }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                      </div>
                    </CardHeader>
                    <CardContent className="px-4 py-0 flex gap-1 flex-wrap">
                      {/* ALL ACTIVE TAGS OF A NOTE */}
                      {note.tags.map(tag => (
                        <Badge key={tag.name} variant="outline"
                          style={{ backgroundColor: tag.color }}>
                          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1,)}</Badge>
                      ))}
                    </CardContent>
                    <CardFooter className="px-4 py-0">
                      <span className="text-xs text-gray-400">Edited: <span>
                        {formatDate(note.date)}</span></span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
          </SidebarGroup>
        </div>

        {/* RESIZE HANDLE */}
        <ResizeHandle onMouseDown={() => {
          isDragging.current = true;
          document.body.style.cursor = "row-resize";
        }} />

        {/* GLOBAL-TAGS SECTION */}
        <SidebarGroup className="overflow-y-auto flex-1 overflow-x-hidden">
          <SidebarGroupLabel className="border-b border-black rounded-none px-0">
            <span className="text-xl font-bold">Tags</span>
          </SidebarGroupLabel>
          {/* INPUT */}
          <div className="flex flex-row gap-1 items-center">
            <Input
              value={tagInput}
              onChange={e => {
                const value = e.target.value;

                if (value.endsWith(",")) {
                  const tagName = value.slice(0, -1).trim().toLowerCase();

                  
                  if (tagName && !globalTags.some(tag => tag.name === tagName)) {

                    const newGlobalTag = {
                      name: tagName,
                      color: getRandomHexColor()
                    }

                    handleNewGlobalTag(newGlobalTag)
                  }

                  setTagInput("");
                } else {
                  setTagInput(value);
                }
              }}
              placeholder="Java, other,"
              className=" mt-2
                        font-mono
                        text-sm
                        bg-muted/40
                        border-dashed
                        border-muted-foreground/30"
            ></Input>

            <TagsInfo desc="Here you can add tags by seberating them with ','"></TagsInfo>
          </div>

          {/* GLOBALTAGS */}
          <div className="flex flex-wrap gap-1 mt-3">
            {sortedGlobalTags.map(tag => (
              <SingleTag tag={tag} Icon={X} key={tag.name + " container"}
                handleTag={handleRemoveGlobalTag}></SingleTag>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      {/* ACCOUNT | LOG OUT SECTION*/}
      <SidebarFooter className="flex flex-col gap-4 items-center">
        {/* ACCOUNT */}
        <Card className="w-full flex flex-row items-center justify-start
           gap-2 px-4 py-4"
           onClick={() => router.push("/dashboard/account")}>

          <CardHeader className="p-0">
            <Image
              src="/globe.svg"
              alt='Vercel'
              width={30}
              height={30}
              loading='eager'
            >
            </Image>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-start p-0">
            <span className="text-sm font-bold">shadcn</span>
            <span className="text-xs">s@wasgeht.at</span>
          </CardContent>
        </Card>
        {/* LOGOUT */}
        <Button className="w-full hover:bg-red-500"
          onClick={() => signOut(auth)}>
          <LogOut></LogOut>
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}