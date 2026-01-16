"use client"

import React from 'react'
import { Hero } from './hero/Hero'
import Features from './features/Features'
import About from './about/About'

const Main = () => {
  return (
    <main className='p-4 md:p-0 w-full bg-black/[0.96] antialiased'>
            <Hero></Hero>
            <Features></Features>
            <About></About>
    </main>
  )
}

export default Main
