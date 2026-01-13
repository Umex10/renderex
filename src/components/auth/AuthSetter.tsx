"use client"

import { useEffect } from "react";
import { auth } from "@/lib/firebase/config";
import { onIdTokenChanged } from "firebase/auth";
import Cookies from "js-cookie"; 

export function AuthSetter({ children }: { children: React.ReactNode }) {
  useEffect(() => {
   
    // Will always call this listener, when the user is logging in/out or when the token exires...
    return onIdTokenChanged(auth, async (user) => {
      if (user) {
        Cookies.set("userId", user.uid, { expires: 7 }); 
      } else {
        Cookies.remove("userId");
      }
    });
  }, []);

  return <>{children}</>;
}