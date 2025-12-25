import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import z from 'zod'
import { AppDispatch, RootState } from '../../redux/store'
import { addNote, editNote, NotesArgs, setActiveNote } from '../../redux/slices/notesSlice'
import { Button } from './ui/button'
import { Plus, Syringe, X } from 'lucide-react'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

const formSchema = z

  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters."),

    tags: z
      .array(z.string()).min(1, "Add at least one tag")
  })

interface DialogFormArgs {
  edit: boolean,
  note?: NotesArgs
}


const DialogForm = ({ edit, note }: DialogFormArgs) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: note ? note.title : "",
      tags: note ? note.tags : []
    }
  })
  const notes = useSelector((state: RootState) => state.notesState.notes);
  const dispatch = useDispatch<AppDispatch>();

  const [tagInput, setTagInput] = useState("");
  const [isEditing] = useState<boolean>(edit ? edit : false);


  const onSubmit = (data: z.infer<typeof formSchema>) => {

    if (isEditing) {

      if (!note) return;
      const newNote = {
        id: note.id,
        title: data.title,
        content: note.content,
        date: new Date().toISOString(),
        tags: data.tags
      }
      dispatch(editNote(newNote))
    } else {

      const length = notes.length;
      const newNote = {

        id: length.toString() + 1,
        title: data.title,
        content: "",
        date: new Date().toISOString(),
        tags: data.tags
      }

      dispatch(addNote(newNote));
      dispatch(setActiveNote(newNote));
    }

    form.reset()
  }

  function removeTag(tagToRemove: string) {
    const tags = form.getValues("tags");

    const newTags = tags.filter(tag => tag !== tagToRemove);
    form.setValue("tags", newTags);
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => form.reset()}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{edit ? "" : "Notes"}</span>
          <Button variant="default" className={`w-6 h-7`}>
            {edit ? (
              <Syringe></Syringe>
            ) : (
              <Plus />
            )}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
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
                        const newTag = value.slice(0, -1).trim().toLowerCase();

                        if (newTag && !field.value.includes(newTag)) {
                          field.onChange([...field.value, newTag])
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
                  <div className="flex gap-1">
                    {field.value.map(tag => (
                      <Badge key={tag} variant="outline" className='flex gap-2'>
                        <span className='text-sm'>{tag.charAt(0).toUpperCase() +
                          tag.slice(1,)}</span>
                        <Button className="w-4 h-4 p-2 rounded-full"
                          onClick={() => removeTag(tag)}>
                          <X className='w-4 h-4'></X>
                        </Button>
                      </Badge>
                    ))}
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

export default DialogForm
