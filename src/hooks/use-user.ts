"use client"

import { editUser } from "@/actions/user";
import { User } from "@/types/user";
import { getAuth, updatePassword } from "firebase/auth";
import { useState } from "react";

interface FormData {
  username?: string,
  email?: string,
  key?: string,
  imageURL?: string
}

export function useUser(initialUser: User) {

  const [user, setUser] = useState(initialUser);
  const auth = getAuth();

  const handleEdit = async (data: FormData) => {

    // fallback array
    const oldUser = { ...initialUser };

    // This will give the user immediate feedback!

    const toEditUser = { ...user }
    setUser({ ...user, ...data });

    try {

      if (data.key) {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        // Firebase does that
        await updatePassword(currentUser, data.key);
      }

      // No need to send the key to the server
      const { key, ...necessaryData } = data;

      // Will sort out undefiend or emty values 
      const filteredData = Object.fromEntries(
        Object.entries(necessaryData)
          .filter(([_, value]) => value !== undefined && value !== "")
      );

      const merged = { ...toEditUser, ...filteredData };

      const result = await editUser(merged);

      if (!result.success) {
        setUser(oldUser);
      }

    } catch (err) {
      console.error("An error occured while calling editUser server action:", err);
      setUser(oldUser);
    }

  }

  return { handleEdit };

}