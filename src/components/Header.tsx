"use server"
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'
import Link from 'next/link'
import Logo from './Logo'
import { Button } from './ui/button'
import { DarkModeToggle } from './DarkModeToggle'
import { cookies } from 'next/headers'

/**
 * Application header containing the logo, navigation and sign-in link.
 * Sticks to the top of the viewport with a blurred background.
 */
const Header = async () => {

  const cookieStore = await cookies();
  const user = cookieStore.get("userId")?.value;

  return (
    <header className="sticky top-0 z-50 w-full
  bg-transparent backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link href='#hero' className='md:w-1/5'>
          <Logo classnames="w-auto h-auto"></Logo>
        </Link>

        {/* Nav items for Landing page */}
        <div className="block md:hidden">
          <MobileNav user={user} />
        </div>

        <div className="hidden md:block w-full flex-1">
          <DesktopNav />
        </div>

        {/* Buttons for Dekstop */}
        <nav className="hidden md:flex flex-row items-center justify-start gap-1
        md:w-1/5">

          {!user ? (
            /* Sign in */
            <Button asChild className='hidden md:block bg-main text-main-foreground rounded-2xl shadow-lg
             hover:scale-105 transition-transform'>
              <Link href="/sign-in">Sign in</Link>
            </Button>

          ) : (

            /* Dashboard */
            <Button asChild variant="link">
              <Link href="/dashboard">Dashboard</Link>
            </Button>

          )}
          <div className='hidden md:block'>
            <DarkModeToggle></DarkModeToggle>
          </div>

        </nav>
      </div>
    </header>
  )
}

export default Header

