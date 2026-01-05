"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "@/lib/firebase/config"
/**
 * Protected dashboard page component.
 * Displays the main workspace where users can view and edit their notes.
 * Handles authentication checks, real-time note updates, and auto-saving functionality.
 * 
 * Features:
 * - Redirects unauthenticated users to sign-in.
 * - Fetches the active note from Firestore based on Redux state.
 * - Provides a Markdown editor and a Live preview tab.
 * - Auto-saves content changes to Firestore with a debounce delay.
 * 
 * @component
 * @returns {JSX.Element | null} The Dashboard page content or null if redirecting/loading.
 */
const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {

    // Return the user to sign in if not logged in
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading information...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <h2>Create or click a note to see the markdown text editor</h2>
  );
}

export default Dashboard
