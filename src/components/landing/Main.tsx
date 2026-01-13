"use client"

import React from 'react'
import { Hero } from './Hero'
import Features from './Features'

const Main = () => {
  return (
    <main className='w-full h-screen bg-black/[0.96] antialiased
     bg-grid-white/[0.02]'>
            <Hero></Hero>
            <Features></Features>
    </main>
  )
}

export default Main
