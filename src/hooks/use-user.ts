"use client"

import { deleteUser, editUser } from "@/actions/user";
import { db } from "@/lib/firebase/config";
import { User } from "@/types/user";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, 
  updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

/**
 * Interface representing the form data for updating user information.
 */
interface FormData {
  username?: string,
  email?: string,
  key?: string,
  imageURL?: string
}

/**
 * Custom hook to manage user state and operations.
 * 
 * This hook handles real-time updates from Firestore, optimistic UI updates,
 * and interactions with Firebase Auth and server actions for user management.
 * 
 * @param {User} initialUser - The initial user data loaded from the server.
 * @returns {Object} An object containing the user state and handler functions.
 * @returns {User} returns.user - The current user state.
 * @returns {React.MutableRefObject<User>} returns.userRef - A ref holding the latest confirmed user state (used for rollbacks).
 * @returns {() => void} returns.removeImage - Function to remove the user's profile image locally.
 * @returns {(data: FormData) => Promise<void>} returns.handleEditUser - Function to handle user profile updates, including sensitive data like password and email.
 * @returns {() => Promise<boolean>} returns.handleDeleteUser - Function to delete the user account.
 */
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
      console.error("An error occurred while catching the user details:", err);
    })

    return () => unsubscribe();
  }, [])


  /**
   * Removes the user's profile image from the local state.
   */
  const removeImage = () => {
    setUser(old => ({
      ...old,
      imageURL: ""
    }))
  }

  /**
   * Handles the update of user information.
   * 
   * Updates the local state optimistically, then attempts to update Firebase Auth
   * (for password/email) and the database via server action. Rolls back on failure.
   * 
   * @param {FormData} data - The data to update.
   */
  const handleEditUser = async (data: FormData) => {

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

        // This checks if the user did log in recently, to ensure better
        // security
        await reauthenticateWithCredential(currentUser, credential);

        // This will actually send out an 2fa like email to the old email
        // to verify the change
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
      console.error("An error occurred while calling editUser server action:", err);
      setUser(oldUser);
    }

  }

  /**
   * Deletes the user account.
   * 
   * Optimistically clears the user state, then calls the server action to delete the user.
   * Rolls back if the deletion fails.
   * 
   * @returns {Promise<boolean>} True if deletion was successful (or initiated), false otherwise.
   */
   const handleDeleteUser = async () => {

    const oldUser = { ...userRef.current };

    // Just needed for immediate feedback
    setUser({uid: "", username: "", imageURL: "", email: "",
      role: "", createdAt: ""
    })

    try {

      const result = await deleteUser(oldUser.uid);

      if (result.success) {
        
      } else {
         setUser(oldUser)
      }

      return true;

    }catch (err) {
      console.error("An error occurred while calling deleteUser server action:", err);
      setUser(oldUser);
      return false;
    }

   }

  return { user, userRef, removeImage, handleEditUser, handleDeleteUser };

}