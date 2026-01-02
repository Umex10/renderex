"use client"

import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Trash2, Camera, X, Check } from 'lucide-react'
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
import { useRouter } from 'next/navigation'

// --- SEPARATE SCHEMAS ---
const usernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const imageSchema = z.object({
  imageURL: z.any().optional(),
});

const emailWithKeySchema = z.object({
  email: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email address"),
  key: z.string().min(6, "Key is required to change email"),
});

const keySchema = z.object({
  key: z.string().min(6, "Key must be at least 6 characters"),
  confirmKey: z.string(),
}).refine((data) => data.key === data.confirmKey, {
  path: ["confirmKey"],
  message: "Keys do not match",
});

type UsernameData = z.infer<typeof usernameSchema>;
type ImageData = z.infer<typeof imageSchema>;
type KeyData = z.infer<typeof keySchema>;
type EmailWithKeyData = z.infer<typeof emailWithKeySchema>;

interface AccountProps {
  initialUser: User
}

const Account = ({ initialUser }: AccountProps) => {
  const { user, userRef, removeImage, handleEdit, handleDelete } = useUser(initialUser);
  const [imageView, setImageView] = useState<string | null>(user.imageURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initialize 4 separate forms
  const usernameForm = useForm<UsernameData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" }
  });

  const imageForm = useForm<ImageData>({
    resolver: zodResolver(imageSchema),
  });

  const emailForm = useForm<EmailWithKeyData>({
    resolver: zodResolver(emailWithKeySchema),
    defaultValues: { email: "", key: "" }
  });

  const keyForm = useForm<KeyData>({
    resolver: zodResolver(keySchema),
    defaultValues: { key: "", confirmKey: "" }
  });

  // --- SHARED ON-SUBMIT LOGIC ---
  const onSubmit = async (data: UsernameData | ImageData | EmailWithKeyData | KeyData) => {
    // Extract confirmKey if it exists (for KeyData)
    const { confirmKey, ...necessaryData } = data;

    // Filter undefined or empty values
    const filteredData = Object.fromEntries(
      Object.entries(necessaryData)
        .filter(([key, value]) => {
          if (key === "imageURL") return value !== undefined && value !== null;
          return value !== undefined && value !== "";
        })
    );

    if (Object.keys(filteredData).length === 0 && !("imageURL" in data)) return;

    try {
      let imageUrlToSave = userRef.current.imageURL;

      // Handle Image Upload Logic
      if ("imageURL" in data) {
        if (data.imageURL instanceof File) {
          const formData = new FormData();
          formData.append("file", data.imageURL);
          formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );

          if (!res.ok) throw new Error("Cloudinary error");
          const cloudinaryData = await res.json();
          imageUrlToSave = cloudinaryData.secure_url;
        } else if (data.imageURL === "") {
          imageUrlToSave = "";
        }
      }

      // Call handleEdit with filtered data
      await handleEdit({
        ...filteredData,
        imageURL: imageUrlToSave,
      });

      // Reset specific forms after success
      usernameForm.reset({ username: "" });
      emailForm.reset({ email: "", key: "" });
      keyForm.reset({ key: "", confirmKey: "" });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // --- IMAGE HELPERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageForm.setValue("imageURL", file);
      const reader = new FileReader();
      reader.onloadend = () => setImageView(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    imageForm.setValue("imageURL", "");
    setImageView(null);
    removeImage(); // Call hook to update backend/state
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDelete = async () => {

    try {
      const result = await handleDelete();

      if (result) {
        router.replace("/sign-in")
      }
    } catch (err) {
      console.error(err);
    }


  }

  return (
    <div className='flex flex-col h-full md:justify-center py-8'>
      <div className="max-w-[425px] w-full mx-auto p-6 bg-white rounded-lg shadow-sm border space-y-8">

        <div>
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <p className="text-sm text-gray-500">Manage your account and security.</p>
        </div>

        {/* --- SECTION 1: PROFILE PICTURE --- */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium uppercase text-gray-400 tracking-wider">Profile Picture</h3>
          <form onSubmit={imageForm.handleSubmit(onSubmit)} className="flex flex-col items-center gap-3">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            <div
              className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageView ? (
                <Image src={imageView} alt="Profile"
                  className="w-full h-full object-cover"
                  width={100} height={100} />
              ) : (
                <Camera size={28} className="text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>

            <div className="flex gap-2">
              {imageView && (
                <Button type="button" variant="ghost" size="sm"
                  onClick={handleRemoveImage} className="text-red-500 h-8">
                  <X size={14} className="mr-1" /> Remove
                </Button>
              )}
              <Button type="submit" size="sm" className="h-8">
                Save Photo
              </Button>
            </div>
          </form>
        </section>

        <hr />

        {/* --- SECTION 2: USERNAME --- */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium uppercase text-gray-400 tracking-wider">Public Identity</h3>
          <form onSubmit={usernameForm.handleSubmit(onSubmit)}>
            <Controller
              name="username"
              control={usernameForm.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <Input {...field} placeholder={user.username} />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button type="submit" className="w-full mt-2">Update username</Button>
          </form>
        </section>

        <hr />

        {/* --- SECTION 3: EMAIL --- */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium uppercase text-gray-400 tracking-wider">Email Settings</h3>
          <form onSubmit={emailForm.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>New Email Address</FieldLabel>
                    <Input {...field} type="email" placeholder={user.email} />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="key"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Current Key</FieldLabel>
                    <Input {...field} type="password" placeholder="••••••••" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Button type="submit" variant="outline" className="w-full mt-2">Verify & Change Email</Button>
          </form>
        </section>

        <hr />

        {/* --- SECTION 4: SECURITY (KEY) --- */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium uppercase text-gray-400 tracking-wider">Security</h3>
          <form onSubmit={keyForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <Controller
                name="key"
                control={keyForm.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>New Key</FieldLabel>
                    <Input {...field} type="password" placeholder="••••••••" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="confirmKey"
                control={keyForm.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Confirm New Key</FieldLabel>
                    <Input {...field} type="password" placeholder="••••••••" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full mt-2">Change Key</Button>
          </form>
        </section>

        {/* --- DELETE ACCOUNT --- */}
        <div className="pt-4 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50">
                <Trash2 size={16} className="mr-2" /> Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Are you absolutely sure?</DialogTitle></DialogHeader>
              <DialogFooter className="flex flex-col gap-2">
                <DialogClose asChild>
                  <Button variant="destructive" className="w-full"
                    onClick={() => onDelete()}>Confirm Deletion</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default Account;