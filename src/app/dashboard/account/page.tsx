"use server"

import { getInitialUser } from '@/actions/user';
import Account from '@/components/Account';
import { User } from '@/types/user';
import { cookies } from 'next/headers';
import React from 'react'

const page = async () => {

   // This will tell us if the user is actually logged in
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

     let initialUser: User = {
        createdAt: "",
        email: "",
        role: "",
        uid: "",
        imageURL: "",
        username: ""
      }

      if (userId) {
          // Load the user when the server starts
          const userResult = await getInitialUser(userId);
      
          if (userResult.success && userResult.data) {
            initialUser = userResult.data
          }
        }
      

  return (
    <Account initialUser={initialUser}></Account>
  )
}

export default page
