import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { NotesArgs } from "../types/notesArgs";
import { Button } from './ui/button'
import { Plus, PlusCircle, Syringe, X } from 'lucide-react'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { auth, db } from "@/lib/firebase/config"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { DialogNoteArgs } from '@/types/dialogNotesArgs';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { addGlobalTag, Tag } from '../../redux/slices/tags/tagsSlice';
import { getRandomHexColor } from '@/utils/getRandomHexColor';
import SingleTag from './SingleTag';

const tagSchema = z.object({
  name: z.string(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/)
});

const formSchema = z

  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters."),

    tags: z
      .array(tagSchema)
  })


/**
 * A dialog form component for creating or editing notes.
 * Uses `react-hook-form` for form handling and validation with `zod`.
 * Fetches note data from Firestore if in edit mode.
 * 
 * @component
 * @param {DialogNoteArgs} data - The props for the component, including edit mode and action handlers.
 * @returns {JSX.Element} The DialogForm component.
 */
const DialogNote = (data: DialogNoteArgs) => {

  const { edit, noteId, onAction } = data;

  const [tagInput, setTagInput] = useState("");
  const [user] = useAuthState(auth);
  const [note, setNote] = useState<NotesArgs | null>(null);

  const globalTags = useSelector((state: RootState) => state.tagsState.globalTags);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user || !data.noteId) return;

    const noteRef = doc(db, "notes", data.noteId);

    const unsubscribe = onSnapshot(noteRef, (snap) => {
      if (!snap.exists()) {
        console.log("Note doesn't exist");
        return;
      }

      const noteData = {
        id: snap.id,
        ...(snap.data() as Omit<NotesArgs, "id">)
      };

      setNote(noteData);
    }, (error) => {
      console.error("Firestore error while getting the active note: ", error);
    });

    return () => unsubscribe();
  }, [user, noteId]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: note ? note.title : "",
      tags: note ? note.tags : []
    }
  })

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        tags: note.tags
      });
    }
  }, [note]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    const tags = form.getValues("tags");

    const newTags = tags.filter(tag => !globalTags.some(globalTag => globalTag.name === tag.name));
    newTags.forEach(tag => dispatch(addGlobalTag(tag)));

    if (edit) {

      if (!note) return;
      onAction({ ...data, content: note.content }, noteId);

    } else {

      onAction(data);
    }

    form.reset()
  }

  const activeTags = form.watch("tags");

  const suggestedTags = useMemo(() => {
    const newTags = globalTags.filter(tag => !activeTags.some(activeTag => activeTag.name === tag.name));

    return newTags.sort((a, b) => a.name.localeCompare(b.name));
  }, [globalTags, activeTags]);

  function removeTag(tagToRemove: Tag) {
    const tags = form.getValues("tags");

    const newTags = tags.filter(tag => tag.name !== tagToRemove.name);
    form.setValue("tags", newTags);

    if (globalTags.some(globalTag => globalTag.name === tagToRemove.name)) return;

    // suggest it again
    suggestedTags.push(tagToRemove);
  }

  function addOutsideTag(tagToAdd: Tag) {
    const tags = form.getValues("tags");
    if (tags.some(tag => tag.name === tagToAdd.name)) return;

    form.setValue("tags", [...tags, tagToAdd]);

    // remove the suggested tag
    suggestedTags.filter(tag => tag !== tagToAdd);
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => form.reset()}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{edit ? "" : "Add"}</span>
          <Button variant="default" className={`w-6 h-7`}>
            {edit ? (
              <Syringe></Syringe>
            ) : (
              <Plus />
            )}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] mb-5">
        <form id="note" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className='mb-5'>
            <DialogTitle>{edit ? "Edit a note" : "Create a note"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder="Title"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid &&
                    <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">Tags</FieldLabel>
                  <Input
                    {...field}
                    id="tags"
                    placeholder="Java, draw"
                    value={tagInput}
                    onChange={e => {
                      const value = e.target.value;

                      if (value.endsWith(",")) {
                        const tagName = value.slice(0, -1).trim().toLowerCase();

                        if (tagName && !field.value.some(tag => tag.name === tagName)) {

                          const newTag = {
                            name: tagName,
                            color: getRandomHexColor()
                          }

                          field.onChange([...field.value, newTag])
                        }

                        if (globalTags.some(globalTag => globalTag.name === tagName)) {
                          suggestedTags.filter(tag => tag.name !== tagName);
                        }

                        setTagInput("");
                      } else {
                        setTagInput(value);
                      }
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid &&
                    <FieldError errors={[fieldState.error]} />}
                  <div className='flex flex-col gap-1'>

                    <div className="flex flex-wrap gap-1">
                      <span>Active: </span>
                      {field.value.map(tag => {
                        if (!globalTags.some(globalTag => globalTag.name === tag.name)) {
                          return <SingleTag tag={tag} Icon={X} key={tag.name + " container"}
                            handleTag={removeTag}></SingleTag>
                        }
                          return <SingleTag tag={tag} Icon={X} key={tag.name + " container"}
                            handleTag={removeTag} noColorChange={true}></SingleTag>
                      })}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <span>Recommended: </span>
                      {suggestedTags.map(tag => (
                        <SingleTag tag={tag} Icon={PlusCircle} key={tag.name + " container"}
                          handleTag={addOutsideTag} noColorChange={true}></SingleTag>
                      ))}
                    </div>

                  </div>

                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" form="note">
                {edit ? "Edit" : "Create"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  )
}

export default DialogNote
