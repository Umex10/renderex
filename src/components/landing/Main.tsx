"use client"

import React from 'react'
import { Hero } from './Hero'
import Features from './Features'

const Main = () => {
  return (
    <main className='p-4 md:p-0 w-full bg-black/[0.96] antialiased'>
            <Hero></Hero>
            <Features></Features>
    </main>
  )
}

export default Main
