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
import Logo from "../layout/Logo"
import Link from "next/link";
import { ArrowDown, ArrowUp, BadgeInfo, Camera, LogOut, Trash2, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { Button } from "../ui/button";
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "../../../redux/store"
import { useDispatch, useSelector } from "react-redux"
import { Badge } from "../ui/badge"
import DialogNote from "./DialogNote"
import { useNotes } from "@/hooks/notes/use-notes";
import { setActiveNote } from "../../../redux/slices/notesSlice";
import { formatDate } from "@/utils/date/formatDate";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react"; // useRef & useEffect hinzugefügt
import { Tag } from "../../types/tag";
import InfoTool from "../shared/InfoTool";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "../ui/multi-select";
import { getRandomHexColor } from "@/utils/color/getRandomHexColor";
import SingleTag from "../tags/SingleTag";
import { useUserTags } from "@/hooks/tags/use-userTags";
import { useMatchedTags } from "@/hooks/tags/use-matchedTags";
import { User } from "@/types/user";
import { useResize } from "@/hooks/shared/use-resize";
import { getInitialUser } from "@/actions/user";


/**
 * The main sidebar component for the application.
 * Displays a list of notes, allows creating new notes, and handles navigation.
 * Uses the `useNotes` hook to manage note state and interactions.
 * * @component
 * @param {AppSidebarArgs} args - The component arguments.
 * @returns {JSX.Element} The AppSidebar component.
 */
export function AppSidebar() {

  const router = useRouter();

  const auth = getAuth();
  const loadedUserRef = useRef<User | null>(null);
  const [loadedUser, setLoadedUser] = useState<User | null>(null);
  const user = useSelector((state: RootState) => state.userState);

  useEffect(() => {

    // It may be that the user uid is not set in the cookie, so we need to make 
    // sure that the user still sees his credentials on fresh registration
    async function notLoadedUser() {
      if (!user && auth.currentUser) {

        const user = await getInitialUser();
        if (!user.data) return;

        const data: User = user.data;
        if (data.uid !== loadedUserRef.current?.uid) {
          setLoadedUser(data);
          loadedUserRef.current = data;
        }
      }
    }
    notLoadedUser();
  }, [user, auth])

  const dispatch = useDispatch<AppDispatch>();

  const [tagInput, setTagInput] = useState("");

  // --- RESIZE LOGIC ---
  const [topHeight, setTopHeight] = useState(425); // start-hight for notes
  const isDragging = useRef(false);
  useResize({ isDragging, setTopHeight });

  // NOTES HOOK
  const {notes, loadingNotes, creatingNote, deletingNote} = useSelector((state: RootState) => state.notesState);
  const {handleCreateNote, handleDeleteNote, handleEditNote } = useNotes(notes);
  const activeNote = useSelector((state: RootState) => state.notesState.activeNote);

  // SORT STATES
  const [sortAfter, setSortAfter] = useState("date");
  const [isDescending, setIsDescending] = useState(true);
  const [isAscending, setIsAscending] = useState(false);

  // Selected Tags to sort more accurately, if the user selected sort after tags.
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  // USER-TAGS HOOKS/STATES

  const {tags: userTags, loadingTags} = useSelector((state: RootState) => state.tagsState);

  // This will hold the last deleted User tag, to ensure notes have also deleted that tag and have 
  // a reference to that tag as well
  const [deletedUserTag, setDeletedUserTag] = useState<Tag | null>(null);

  const { handleCreateUserTag, handleDeleteUserTag, handleEditUserTag } = useUserTags({ setDeletedUserTag });

  
  // Ensures that these objects are sorted, and matched with other states, to ensure the same data
  const { refactoredNotes, sortedUserTags } = useMatchedTags({
    notes, userTags, handleEditNote,
    sortAfter, isDescending, selectedTags, deletedUserTag, setDeletedUserTag
  }
  );

  // This will kee track of the selected items, if the user sorts the notes after tags
  const handleSelectionChange = (selected: Tag[]) => {
    setSelectedTags(selected)
  }

  // This will ubdate the color of the tags inside the notes, if the tag color was changed
  // in the Sidebar "Tags" section. So it will match.
  const handleEditedColorNotes = (toEditTag: Tag, tagColor: string) => {

    const editedNotes = notes.filter(note =>
      note.tags.some(tag => tag.name === toEditTag.name)
    );

    editedNotes.forEach(note => {
      const updatedTags = note.tags.map(tag =>
        tag.name === toEditTag.name
          ? { ...tag, color: tagColor }
          : tag
      );
      handleEditNote({ title: note.title, content: note.content, tags: updatedTags }, note.id);
    });
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

        {/* ADD + | SORT SECTION - dynamic height */}
        <div style={{ height: topHeight, minHeight: '190px' }} className="flex flex-col">
          <SidebarGroup className="overflow-y-auto flex-1">
            <SidebarGroupLabel className="border-b border-border rounded-none px-0 cursor-pointer"
              onClick={() => router.push("/dashboard")}>
              <span className="text-xl font-bold">Notes</span>
            </SidebarGroupLabel>
            <div
              className="w-full mt-3 md:w-auto flex flex-row justify-between
            items-center md:gap-6"
            >
              {/* ADD + */}
              <DialogNote edit={false} handleCreateNote={handleCreateNote}
                handleEditNote={handleEditNote} handleNewUserTag={handleCreateUserTag}
                handleEditUserTag={handleEditUserTag} handleEditedColorNotes={handleEditedColorNotes}></DialogNote>

              {/* SORT */}
              <div className="flex flex-row items-center gap-1">

                <Select
                  defaultValue="date"
                  onValueChange={(value) => setSortAfter(value)}
                >
                  <SelectTrigger
                    className={`max-w-[70px] px-1 border-2 border-border`}
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
                  className={`w-8 h-8 cursor-pointer
                ${isDescending ? "text-main" : ""} `}
                  onClick={() => {
                    setIsDescending(!isDescending);
                    setIsAscending(!isAscending);
                  }}
                  data-testid="desc"
                ></ArrowDown>
                <ArrowUp
                  className={`w-8 h-8 cursor-pointer
                ${isAscending ? "text-main" : ""} `}
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
                  items={sortedUserTags}
                  selected={selectedTags}
                  onChange={handleSelectionChange}
                  placeholder="Tags..."
                />
              </div>
            )}

            {/* NOTES SECTION */}
            <div className="flex flex-col gap-4 mt-2">

              {refactoredNotes.length === 0 && loadingNotes && (
                <p className="text-center">Loading Notes...</p>
              )}

              {refactoredNotes.length === 0 && !loadingNotes && (
                <p className="text-center">No notes set yet, waiting...</p>
              )}

              {refactoredNotes.length !== 0 && refactoredNotes.map(note => (
                <Card key={note.id} className="flex flex-col gap-2 py-2 hover:scale-105
                  transform-all ease-out duration-300 cursor-pointer"
                  data-testid="note-card"
                  onClick={() => {
                    if (!creatingNote.status || activeNote !== note.id) {
                      dispatch(setActiveNote(note.id));
                      router.push(`/dashboard/note/${note.id}`)
                    }
                  }}>
                  {creatingNote.noteId === note.id ? (
                    <CardHeader className="px-4 py-0"
                    data-testid="creating-note-status">
                      <h2>Creating note: ${note.title}</h2>
                    </CardHeader>

                  ) : deletingNote.noteId === note.id ? (
                    <CardHeader className="px-4 py-0"
                    data-testid="deleting-note-status">
                      <h2>Deleting note: ${note.title}</h2>
                    </CardHeader>

                  ) : (
                    <>
                      <CardHeader className="px-4 py-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="leading-tight">
                            {note.title.charAt(0).toUpperCase() +
                              note.title.slice(1,)}
                          </CardTitle>
                          <div className="flex justify-center items-center gap-1"
                            onClick={(e) => e.stopPropagation()}>
                            {/* EDIT NOTE DIALOG BUTTON */}
                            <DialogNote note={note} edit={true}
                              handleCreateNote={handleCreateNote}
                              handleEditNote={handleEditNote} handleNewUserTag={handleCreateUserTag}
                              handleEditUserTag={handleEditUserTag}
                              handleEditedColorNotes={handleEditedColorNotes}></DialogNote>
                            {/* DELETE NOTE */}
                            <Button variant="secondary" className="w-8 h-8 p-0
                        hover:scale-105" type="button" 
                        data-testid="delete-button"
                              onClick={(e) => {
                                handleDeleteNote(e, note.id);
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
                        <span className="text-xs text-muted-foreground">Edited: <span>
                          {formatDate(note.date)}</span></span>
                      </CardFooter>
                    </>
                  )}

                </Card>
              ))}
            </div>
          </SidebarGroup>
        </div>

        {/* RESIZE HANDLE */}
        {/* The divider between the notes and tags, which is dragable */}
        <div
          className="h-1.5 cursor-row-resize bg-border hover:bg-main transition-colors duration-150"
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = "row-resize";
          }}
        />

        {/* USER-TAGS SECTION */}
        <SidebarGroup className="overflow-y-auto flex-1 overflow-x-hidden">
          <SidebarGroupLabel className="border-b border-border rounded-none px-0 cursor-pointer"
            onClick={() => router.push("/dashboard")}>
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


                  if (tagName && !userTags.some(userTag => userTag.name === tagName)) {

                    const newUserTag = {
                      name: tagName,
                      color: getRandomHexColor()
                    }

                    handleCreateUserTag(newUserTag)
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

            <InfoTool desc="Here you can add tags by seberating them with ','"
              triggerClasses="mt-2">
              <BadgeInfo>

              </BadgeInfo>
            </InfoTool>
          </div>

          {/* USER-TAGS */}
          <div className="flex flex-wrap gap-1 mt-3">
            {sortedUserTags.length !== 0 && sortedUserTags.map((sortedUserTag, index) => (
              <SingleTag tag={sortedUserTag} Icon={X}
              key={`${sortedUserTag.name}-${sortedUserTag.color}-${index}`}
                handleDeleteUserTag={handleDeleteUserTag}
                handleEditUserTag={handleEditUserTag}
                handleEditedColorNotes={handleEditedColorNotes}></SingleTag>
            ))}

            {loadingTags && sortedUserTags.length === 0 && (
              <span className="w-full text-center">Loading tags...</span>
            )}

            {!loadingTags && sortedUserTags.length === 0 && (
              <span className="w-full text-center">No tags set yet, waiting...</span>
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>
      {/* ACCOUNT | LOG OUT SECTION*/}
      <SidebarFooter className="flex flex-col gap-4 items-center">
        {/* ACCOUNT */}
        <Card className="w-full flex flex-row items-center justify-start
            gap-2 px-4 py-4 cursor-pointer"
            data-testid="user-card"
          onClick={() => router.push("/dashboard/account")}>

          <CardHeader className="p-0">
            {user?.imageURL ? (
              <Image
                src={user.imageURL}
                alt='Image of the user'
                width={48}
                height={48}
                loading='eager'
                className="w-12 h-10 rounded-full"
              >
              </Image>
            ) : (
              <Camera size={28} className="text-muted-foreground" />
            )}
          </CardHeader>

          {user ? (
            <CardContent className="w-full flex flex-col items-start p-0">
              <span className="text-sm font-bold"
              data-testid="user-username">{user.username}</span>
              <span className="text-xs"
              data-testid="user-email">{user.email}</span>
            </CardContent>
          ) : (
            <CardContent className="w-full flex flex-col items-start p-0">
              <span className="text-sm font-bold"
              data-testid="user-username">{loadedUser?.username}</span>
              <span className="text-xs"
              data-testid="user-email">{loadedUser?.email}</span>
            </CardContent>
          )}

        </Card>
        {/* LOGOUT */}
        <Button className="w-full bg-black text-white hover:bg-red-500"
          onClick={() => signOut(auth)}>
          <LogOut></LogOut>
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}