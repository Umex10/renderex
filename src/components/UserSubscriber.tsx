import { User } from "@/types/user";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { setRetrietUser, setUser } from "../../redux/slices/userSlice";
import { useAuthState } from "react-firebase-hooks/auth";

 interface UserSubscriberArgs {
   initialUser: User
 }

 export function UserSubscriber({initialUser}: UserSubscriberArgs) {

  const dispatch = useDispatch<AppDispatch>();
  const [user, loading] = useAuthState(auth);

  // This will ensure, that we will not load the globalTags uneccessarily since 
  // we are getting it from the server action already on mount
  const firstCall = useRef(true); 

  useEffect(() => {
    dispatch(setRetrietUser(initialUser));
  }, [])

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

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

      dispatch(setUser(convertedUser as User));

    }, (err) => {
      console.error("An error occurred while catching the user details:", err);
    })

    return () => unsubscribe();
  }, [])


  return null;
 }