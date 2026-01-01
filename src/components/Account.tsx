"use client"

import React, { useState, useRef, useId } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Trash2, Camera, X } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog'
import { User } from '@/types/user'
import { useUser } from '@/hooks/use-user'

// FORM SCHEMA
export const accountSchema = z
  .object({
    // Allowing "any" for now as File objects are easier to handle manually.
    // Optional field in case the user doesn't want to upload an image.
    imageURL: z.any().optional(),
    username: z.string().optional(),  // optional now
    email: z.string().optional(),     // optional now
    key: z.string().optional(),       // optional password
    confirmKey: z.string().optional(),// optional confirm
  })
  .superRefine((data, ctx) => {
    const { key, confirmKey, username, email } = data;

    // ----------------------------
    // Password validation
    // ----------------------------
    if (key || confirmKey) {
      if (!key) {
        ctx.addIssue({
          path: ["key"],
          message: "Key is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!confirmKey) {
        ctx.addIssue({
          path: ["confirmKey"],
          message: "Please confirm your key",
          code: z.ZodIssueCode.custom,
        });
      }

      if (key && confirmKey && key !== confirmKey) {
        ctx.addIssue({
          path: ["confirmKey"],
          message: "Keys do not match",
          code: z.ZodIssueCode.custom,
        });
      }

      if (key && key.length < 6) {
        ctx.addIssue({
          path: ["key"],
          message: "Key must be at least 6 characters",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // ----------------------------
    // Username validation
    // Only check if username is set (non-empty)
    // ----------------------------
    if (username && username.trim().length < 3) {
      ctx.addIssue({
        path: ["username"],
        message: "Username must be at least 3 characters",
        code: z.ZodIssueCode.custom,
      });
    }

    // ----------------------------
    // Email validation
    // Only check if email is set (non-empty)
    // ----------------------------
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      ctx.addIssue({
        path: ["email"],
        message: "Invalid email address",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type AccountSchema = z.infer<typeof accountSchema>;

interface Account {
  initialUser: User
}

const Account = ({ initialUser }: Account) => {

  const { handleEdit } = useUser(initialUser);

  // State for local image view
  const [imageView, setImageView] = useState<string | null>(null);

  // Reference for the hidden file input field (needed for style)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Form
  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      key: "",
      confirmKey: ""
    }
  });

  // Handler for image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validierung in RHF
      form.setValue("imageURL", file, { shouldValidate: true });

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageView(base64String);
      };

      reader.onerror = (err) => console.error("Reader Fehler:", err);

      reader.readAsDataURL(file);
    }
  };

  // Handler to remove the selected image
  const handleRemoveImage = () => {
    form.setValue("imageURL", null);
    setImageView(null);
    // Reset the file input value so the same image can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger click event on the hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: AccountSchema) => {

    const { confirmKey, ...necessaryData } = data;

    handleEdit(necessaryData);

    form.reset();

  };

  const handleDelete = () => {
    console.log("Delete account triggered");
  };

  return (
    <div className='flex flex-col h-full md:justify-center'>
      <div className="max-w-[425px] w-full mx-auto p-6 bg-white rounded-lg shadow-sm border">
        <div className='mb-6'>
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <p className="text-sm text-gray-500">Edit your account information.</p>
        </div>

        <form id="account-form" onSubmit={form.handleSubmit(onSubmit)}>

          {/* --- ACCOUNT IMAGE SECTION --- */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {/* Image */}
            <div
              className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={triggerFileInput}
            >
              {/* New image */}
              {imageView ? (
                <Image
                  src={imageView}
                  alt="Profil"
                  className="w-full h-full object-cover"
                  width={200}
                  height={100}
                />
              ) : (
                // Fallback
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera size={32} />
                </div>
              )}
            </div>

            {/* Remove image button */}
            {imageView && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-500"
              >
                <X size={14} /> Remove image
              </Button>
            )}
          </div>
          {/* -------------------------------- */}

          <div className="grid gap-4">
            {/* USERNAME */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    placeholder={initialUser.username}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* EMAIL */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder={initialUser.email}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* KEY (PASSWORD) */}
            <Controller
              name="key"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="key">Key</FieldLabel>
                  <Input
                    {...field}
                    id="key"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* CONFIRM KEY */}
            <Controller
              name="confirmKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmKey">Confirm Key</FieldLabel>
                  <Input
                    {...field}
                    id="confirmKey"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {/* SAVE BUTTON */}
            <Button type="submit" className="w-full">
              Save Changes
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full flex gap-2 text-white"
                >
                  <Trash2 size={16} />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>


                <DialogFooter className='flex flex-col gap-2'>
                  <DialogClose>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full flex text-white"
                      onClick={handleDelete}
                    >
                      Yes
                    </Button>
                  </DialogClose>

                  <DialogClose>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex"
                    >
                      No
                    </Button>
                  </DialogClose>
                </DialogFooter>

              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>

  );
}

export default Account;