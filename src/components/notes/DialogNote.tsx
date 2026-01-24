"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import { Plus, PlusCircle, Syringe, X } from 'lucide-react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { DialogNoteArgs } from '@/types/dialogNotesArgs';
import { useSelector } from 'react-redux';
import {  RootState } from '../../../redux/store';

import { getRandomHexColor } from '@/utils/color/getRandomHexColor';
import SingleTag from '../tags/SingleTag';
import { useDialog } from '@/hooks/notes/use-dialog';

// DIALOG FORM SCHEMA
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

export type FormSchema = z.infer<typeof formSchema>;
/**
 * A dialog form component for creating or editing notes.
 * Uses `react-hook-form` for form handling and validation with `zod`.
 * Fetches note data from Firestore if in edit mode.
 * 
 * @component
 * @param {DialogNoteArgs} data - The args for the component, including edit mode and action handlers.
 * @returns {JSX.Element} The DialogForm component.
 */
const DialogNote = (data: DialogNoteArgs) => {

  const {note, edit, handleCreateNote, handleEditNote, handleNewUserTag,
    handleEditUserTag, handleEditedColorNotes
   } = data;

  const [tagInput, setTagInput] = useState("");

  const userTags = useSelector((state: RootState) => state.tagsState.tags);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: note ? note.title : "",
      tags: note ? note.tags : []
    }
  })

  // Starts a subscribe listener and is handling the tags in a Dialog
  const {suggestedTags, removeTag, addSuggestedUserTag
    , removeSuggestedUserTag} = useDialog({form, userTags});

  // Load the data of the note while editing
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        tags: note.tags
      });
    }
  }, [note, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    const tags = form.getValues("tags");

    // Will add all new tags to user Tags, that he doesn't contain yet
  
    const newTags = tags.filter(tag => !userTags.some(userTag => userTag.name === tag.name));
    newTags.forEach(tag => handleNewUserTag(tag));

    if (edit) {

      if (!note || !note.id) return;

      handleEditNote({ ...data, content: note.content }, note.id);

    } else {
     
      handleCreateNote(data);
    }

    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => form.reset()}
        data-testid={`${edit ? "edit-button" : "add-button"}`}
        type='button'>
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-lg"
          >{edit ? "" : "Add"}</span>
          <Button variant="default" className={`w-6 h-7`} type='button'>
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
                    data-testid="note-title"
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
                    data-testid="note-tags"
                    placeholder="Java, draw"
                    value={tagInput}
                    onChange={e => {
                      const value = e.target.value;

                      if (value.endsWith(",")) {
                        const tagName = value.slice(0, -1).trim().toLowerCase();
                    

                        // Is there already a tag with the same name?
                        if (tagName && !field.value.some(tag => tag.name === tagName)) {
                   

                        // If found, we must not create an extra tag with a new color
                        const found = userTags.find(userTag => userTag.name === tagName);

                        if (found) {

                              removeSuggestedUserTag(found);
                              field.onChange([...field.value, found])
                             
                        } else {
                            const newTag = {
                            name: tagName,
                            color: getRandomHexColor()
                          }
                          
                          field.onChange([...field.value, newTag])
                        }};

                        setTagInput("");
                      } else {
                        setTagInput(value);
                      }
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid &&
                    <FieldError errors={[fieldState.error]} />}

                  {/* ACTIVE | SUGGESTED (USER) TAGS SECTION */}
                  <div className='flex flex-col gap-1'>

                    {/* ACTIVE TAGS */}
                    <div className="flex flex-wrap gap-1">
                      <span>Active: </span>
                      {field.value.map(tag => {
                        if (!userTags.some(userTag => userTag.name === tag.name)) {
                          return <SingleTag tag={tag} Icon={X} key={`new-active-${tag.name}`}
                            handleDeleteUserTag={removeTag}
                            handleEditUserTag={handleEditUserTag}
                            handleEditedColorNotes={handleEditedColorNotes}></SingleTag>
                        }
                        // If it is an User Tag already, user can't change it's color
                          return <SingleTag tag={tag} Icon={X} key={`matched-active-${tag.name}`}
                            handleDeleteUserTag={removeTag} noColorChange={true}
                            handleEditUserTag={handleEditUserTag}
                            handleEditedColorNotes={handleEditedColorNotes}></SingleTag>
                      })}
                    </div>

                    {/* SUGGESTED (USER) TAGS */}
                    <div className="flex flex-wrap gap-1">
                      <span>Recommended: </span>
                      {suggestedTags.map(suggestedTag => (
                        <SingleTag tag={suggestedTag} Icon={PlusCircle} key={`suggested-${suggestedTag.name}`}
                          handleDeleteUserTag={addSuggestedUserTag} noColorChange={true}
                          handleEditUserTag={handleEditUserTag}
                            handleEditedColorNotes={handleEditedColorNotes}></SingleTag>
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
            <DialogClose asChild
            data-testid={`${edit ? "edit-confirmation-button" : "create-confirmation-button"}`}>
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
