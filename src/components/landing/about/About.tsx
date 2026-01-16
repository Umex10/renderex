"use client"

import React, { useState } from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import Image from 'next/image'
import AttributesCard from './AttributesCard'
import {Stack} from './Stack'

const About = () => {

  const [isHovering, setIsHovering] = useState(false);

  return (
    <section id="about" className='mt-10 relative w-full h-full min-h-screen-header'>

      <div className='w-full max-w-7xl h-full min-h-screen 
      overflow-visible mx-auto'>
        <div className='z-10'>
          <h2 className="main-heading">
            Renderex and <br /> it{"'"}s builder
          </h2>
          <p className="sub-context">
            Renderex is a solo-built project created to gain real-world experience by building real software.
          </p>
        </div>

        <div className='w-full mt-10 flex flex-row gap-1'>
            <div className='w-1/2 h-[800px] relative z-0'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}>
          <Image
            src="/image.jpg"
            fill
            alt="Notes"
            className={`absolute inset-0 rounded-lg z-0 ${isHovering ? "blur" : ""}`}
          />
          <Card className={`z-10 bg-transparent w-full h-full
        flex flex-col items-center ${isHovering ? "blur" : ""}`}>
            <CardHeader className='mt-8 w-full text-center max-w-[400px] px-1 py-3
  bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl'>
              <CardTitle>Umejr Dzinovic - Software Devotee</CardTitle>
            </CardHeader>

            <CardFooter className="mt-auto z-10 w-full flex flex-col
          gap-1 items-center p-4
 backdrop-blur-md">

              <AttributesCard date='2025 - now'
                attribute='Mastering Scalable Architectures'></AttributesCard>
                
             <AttributesCard date='2024 - 2025'
                attribute=' B.Sc. start with Academic Excellence'></AttributesCard>

              <AttributesCard date='2023 - 2024'
                attribute="First Hello world's across diverse languages"></AttributesCard>

            </CardFooter>
          </Card>

          {isHovering && (
            <div className='z-10 absolute top-1/2 left-1/2 -translate-x-1/2
          -translate-y-1/2 pointer-events-none'>
              <h3 className=''>
                Dev-Resume
              </h3>
            </div>
          )}
        </div>

        <div className='w-1/2 h-[800px] flex flex-col gap-1'>
          <div className='w-full relative h-2/3 z-0'>
           <Image
            src="/stack.png"
            fill
            alt="Notes"
            className={`object-cover  absolute inset-0 rounded-lg z-0`}
          />
                <Card className={`z-10 bg-transparent w-full h-full
        flex flex-col items-center`}>
            <CardHeader className='mt-8 w-full text-center max-w-[300px] px-1 py-3
  bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl'>
              <CardTitle>Renderex - Tool Stack</CardTitle>
            </CardHeader>

            <CardFooter className="reltative mt-auto z-10 w-full flex flex-col gap-1">
                <Stack></Stack>
                 <Stack></Stack>
            </CardFooter>
          </Card>
          </div>

           <div className='w-full h-1/3 flex flex-row gap-1'>
                <div className='w-1/2 text-center'>
                  Hello
                </div>

                <div className='w-1/2 text-center'>
                  hello
                </div>
          </div>
        </div>
        </div>
      
      </div>


    </section>
  )
}

export default About
