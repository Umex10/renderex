"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "@/lib/firebase/config"

/**
 * Protected dashboard page.
 * Redirects unauthenticated users to the sign-in page and
 * shows a loading state while Firebase auth is initializing.
 */
const Dashboard = () => {
   const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return null; 
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
}

export default Dashboard
