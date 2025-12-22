import React from 'react'
import Image from 'next/image'
import MobileNavbar from './MobileNavbar'
import DesktopNavbar from './DesktopNavbar'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <a href='#hero'>
          <Image
            src="/renderex.png"
            alt='Renderex-Logo'
            width={150}
            height={150}
            loading='eager'
            className='w-auto h-auto'>
          </Image>
        </a>

        {/* Navbar */}
        <div className="flex flex-row items-center gap-1">
          <div className="block md:hidden">
            <MobileNavbar />
          </div>

          <div className="hidden md:block">
            <DesktopNavbar />
          </div>
          {/* Sign in */}
          <Link href="/sign-in">Sign in</Link>
        </div>
      </div>
    </header>
  )
}

export default Header


