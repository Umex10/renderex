"use client"

import React, { useState } from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card"
import Image from 'next/image'
import AttributesCard from './AttributesCard'
import { Stack } from './Stack'
import { ExternalLinkIcon } from 'lucide-react'
import { motion } from "framer-motion";

const About = () => {

  const [isHovering, setIsHovering] = useState(false);

  return (
    <section id="about" className='mt-10 relative w-full h-full min-h-screen-header'>

      <div className='w-full max-w-[1400px] h-full min-h-screen 
      overflow-visible mx-auto'>
        <div className='z-10'>
          <h2 className="main-heading">
            Renderex about
          </h2>
          <p className="sub-context">
            Renderex is a solo-built project created to gain real-world experience by building real software.
          </p>
        </div>

        {/* ABOUT - Container */}
        <div className='w-full mt-10 flex md:h-[700px] flex-col md:flex-row gap-30 md:gap-1
        rounded-xl'>
          {/* My Image */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(180,70,230,0.3)",
                "0 0 50px rgba(180,70,230,0.5)",
                "0 0 20px rgba(180,70,230,0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className='w-full md:w-2/5 h-[500px] md:h-full relative z-0 cursor-pointer
            rounded-xl'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => window.open("https://dev-resume-sigma.vercel.app", "_blank")}
          >

            <Image
              src="/image.jpg"
              fill
              alt="Notes"
              className={`absolute inset-0 rounded-lg z-0 ${isHovering ? "blur" : ""}`}
            />
            {/* Text Content on the image card */}
            <Card className={`z-10 bg-transparent w-full h-full
        flex flex-col items-center ${isHovering ? "blur" : ""}`}>
              <CardHeader className='mt-8 w-full text-center max-w-[350px] md:max-w-[400px] px-1 py-2 md:p-3
  bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl'>
                <CardTitle>Umejr Dzinovic — Software Devotee</CardTitle>
              </CardHeader>

              <CardFooter className="mt-auto -mb-24 z-10 w-full flex flex-col
          gap-1 items-center p-4 md:p-0
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

                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  View My Dev Resume
                  <ExternalLinkIcon className="-mt-1 w-5 h-5" />
                </h3>
              </div>
            )}
          </motion.div>

          {/* Container of Tool-stack, github and */}

          <div className='w-full md:w-3/5 h-[600px] md:h-[800px] flex flex-col gap-4'>
          {/* Toolstack */}
            <div className='w-full relative h-1/2 z-0'>
              <Image
                src="/stack.png"
                fill
                alt="Notes"
                className={`object-cover absolute inset-0 rounded-lg z-0 
                  `}
              />

              <span
                className="absolute -top-10 bottom-0 -right-10 w-42 rounded-full
    bg-gradient-to-l from-black/100 via-black/70 to-black/40 blur-xl"
                aria-hidden
              />
              <span
                className="absolute bottom-0 overflow-hidden -left-0 -right-10 h-90
    bg-gradient-to-t from-black/100 via-black/60 to-black/30 blur-sm"
                aria-hidden
              />
              <Card className={`z-10 bg-transparent w-full h-full
        flex flex-col items-center`}>
                <CardHeader className='mt-8 w-full text-center max-w-[250px] px-1 py-3
  bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl'>
                  <CardTitle>Renderex — Tool Stack</CardTitle>
                </CardHeader>

                <CardFooter className="reltative mt-auto z-10 w-full flex flex-col gap-1">
                  <Stack></Stack>
                </CardFooter>
              </Card>
            </div>


            {/* Github and ... */}
            <div className='w-full h-1/2 flex flex-row gap-1'>
            {/* Github */}
              <div className='w-1/2 h-full text-center cursor-pointer'
              onClick={() => window.open("https://github.com/Umex10/renderex", "_blank")}>
                <Card className="z-10 bg-transparent w-full h-full flex flex-col items-center">
                  <CardHeader className="mt-8 w-full text-center max-w-[250px] px-1 py-3
    bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
                    <CardTitle>Renderex — GitHub</CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm text-white/80 text-center mt-auto px-4">
                    The full source code behind Renderex — built, tested, 
                    and evolved as a real-world project.
                  </CardContent>

                  <CardFooter className="relative mt-auto z-10 w-full flex flex-col items-center gap-2 pb-6">
                    <span className="text-xs uppercase tracking-widest text-white/50">
                      View on GitHub
                    </span>
                  </CardFooter>
                </Card>
              </div>

              {/* And.. */}
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
