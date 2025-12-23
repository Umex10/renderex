"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import MobileNavbar from './MobileNavbar'
import DesktopNavbar from './DesktopNavbar'
import Link from 'next/link'
import { auth } from "@/lib/firebase/config"
import { useAuthState } from 'react-firebase-hooks/auth'
import Logo from './Logo'

/**
 * Application header containing the logo, navigation and sign-in link.
 * Sticks to the top of the viewport with a blurred background.
 */
const Header = () => {

  const [user, loadingUser] = useAuthState(auth);

  useEffect(() => {
    if (!loadingUser && user) {
    }
  }, [user, loadingUser])

  if (loadingUser) {
    return <div>Checking if logged in...</div>
  }


  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <a href='#hero'>
          <Logo classnames="w-auto h-auto"></Logo>
        </a>

        {/* Navbar */}
        <div className="flex flex-row items-center gap-1">
          <div className="block md:hidden">
            <MobileNavbar />
          </div>

          <div className="hidden md:block">
            <DesktopNavbar />
          </div>
          {!user ? (
            /* Sign in */
            <Link href="/sign-in">Sign in</Link>
          ) : (
            /* Dashboard */
            <Link href="/dashboard">Dashboard</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header


