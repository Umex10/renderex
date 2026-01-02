"use client"

import { deleteU, editUser } from "@/actions/user";
import { db } from "@/lib/firebase/config";
import { User } from "@/types/user";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, 
  updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

interface FormData {
  username?: string,
  email?: string,
  key?: string,
  imageURL?: string
}

export function useUser(initialUser: User) {

  // This will be our fallback, if something is going wrong with firebase
  const userRef = useRef<User>(initialUser);

  // This is our UI immediate feedback!
  const [user, setUser] = useState<User>(initialUser);

  // This will ensure, that we will not load the globalTags uneccessarily since 
  // we are getting it from the server action already on mount
  const firstCall = useRef(true);

  // Needed because the key credentials are handeld differently than other fields
  const auth = getAuth();

  useEffect(() => {
    if (!userRef.current) return;

    const ref = doc(db, "users", userRef.current.uid);

    const unsubscribe = onSnapshot(ref, (snap) => {

      if (firstCall.current) {
        firstCall.current = false;
        return;
      }

      if (!snap.exists()) {
        throw new Error("There is no such user!");
      }

      const data = snap.data();

      const convertedUser = {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString()
      }

      userRef.current = convertedUser as User;
      setUser(convertedUser as User);

    }, (err) => {
      console.error("Firestore error occured while catching the user details:", err);
    })

    return () => unsubscribe();
  }, [])


  const removeImage = () => {
    setUser(old => ({
      ...old,
      imageURL: ""
    }))
  }

  const handleEdit = async (data: FormData) => {

    // fallback array
    const oldUser = { ...userRef.current };

    // This will give the user immediate feedback!

    setUser({ ...userRef.current, ...data });

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Needed because firebase needs to do the changes
      if (data.key && !data.email) {

        await updatePassword(currentUser, data.key);
      }

      if (data.email && data.email !== currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email!,
          data.key || "" 
        );

        await reauthenticateWithCredential(currentUser, credential);

        await verifyBeforeUpdateEmail(currentUser, data.email);
       
      }

      // We don't need the key anymore, to ensure key is not written onto firebase mistakenly
      const {key, ...reducedData} = data;

      const merged = { ...oldUser, ...reducedData };

      const result = await editUser(merged);

      if (result.success) {
        userRef.current = merged;
      } else {
        setUser(oldUser); // Rollback
      }
    } catch (err) {
      console.error("An error occured while calling editUser server action:", err);
      setUser(oldUser);
    }

  }

   const handleDelete = async () => {

    const oldUser = { ...userRef.current };

    setUser({uid: "", username: "", imageURL: "", email: "",
      role: "", createdAt: ""
    })

    try {

      const result = await deleteU(oldUser.uid);

      if (result.success) {
        
      } else {
         setUser(oldUser)
      }

      return true;

    }catch (err) {
      console.error("An error occured while calling deleteUser server action:", err);
      setUser(oldUser);
      return false;
    }

   }

  return { user, userRef, removeImage, handleEdit, handleDelete };

}