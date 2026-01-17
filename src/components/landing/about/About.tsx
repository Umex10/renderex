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
import { ExternalLinkIcon, Github } from 'lucide-react'
import { motion } from "framer-motion";
import { Workflow } from './Workflow'

const About = () => {

  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isHoveringGithub, setIsHoveringGithub] = useState(false);

  return (
    <section id="about" className='mt-10 relative w-full h-full min-h-screen-header'>

      <div className='w-full max-w-[1400px] h-full min-h-screen 
      overflow-visible mx-auto'>
        <div className='z-10'>
          <h2 className="main-heading">
            About Renderex
          </h2>
          <p className="sub-context">
            Renderex is a solo-built project created to gain real-world experience by building real software.
          </p>
        </div>

        {/* ABOUT - Container */}
        <div className='w-full mt-10 flex lg:h-[700px] items-center flex-col lg:flex-row
         lg:items-center gap-3 
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
            className='w-full max-w-[400px] lg:max-w-none lg:w-2/5 
            h-[500px] lg:h-[550px] xl:h-[700px] 2xl:h-full relative z-0 cursor-pointer
            rounded-xl'
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
            onClick={() => window.open("https://dev-resume-sigma.vercel.app", "_blank")}
          >

            <Image
              src="/image.jpg"
              fill
              alt="Image of the builder"
              className={`absolute inset-0 rounded-lg z-0 ${isHoveringImage ? "blur" : ""}`}
            />
            {/* Text Content on the image card */}
            <Card className={`z-10 bg-transparent w-full h-full
        flex flex-col items-center ${isHoveringImage ? "blur" : ""}`}>
              <CardHeader className='mt-2 w-full text-center max-w-[350px] md:max-w-[400px] 
              p-2  bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl 
              rounded-2xl'>
                <CardTitle>Umejr Dzinovic — Software Devotee</CardTitle>
              </CardHeader>

              <CardFooter className="mt-auto -mb-24 md:-mb-16 z-10 w-full flex flex-col
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

            {isHoveringImage && (
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

          <div className='mt-20 lg:mt-0 w-full md:w-4/5 lg:w-3/5  lg:h-[700px] flex flex-col gap-4'>
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
        flex flex-col items-center gap-2`}>
                <CardHeader className='mt-8 w-full text-center max-w-[250px] px-1 py-3
  bg-violet-400/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl'>
                  <CardTitle>Renderex — Tool Stack</CardTitle>
                </CardHeader>

                <CardFooter className="relative mt-auto z-10 w-full">
                  <Stack></Stack>
                </CardFooter>
              </Card>
            </div>

            {/* Github and ... */}
            <div className='w-full h-full lg:h-1/2 flex flex-col md:flex-row gap-2'>
              {/* Github */}
              <div className='relative w-full md:w-1/2 h-full text-center cursor-pointer'
                onMouseEnter={() => setIsHoveringGithub(true)}
                onMouseLeave={() => setIsHoveringGithub(false)}
                onClick={() => window.open("https://github.com/Umex10/renderex", "_blank")}>

                <Workflow isHoveringGithub={isHoveringGithub}></Workflow>

                {isHoveringGithub && (
                  <div className='z-10 absolute top-1/2 left-1/2 -translate-x-1/2
          -translate-y-1/2 pointer-events-none'>

                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      View My
                      <Github className=" w-10 h-10" />
                    </h3>
                  </div>
                )}
              </div>

              {/* And.. */}

              <div className='relative w-full md:w-1/2 h-full text-center'>
                <Card className={`z-10 bg-transparent w-full h-full flex flex-col
                items-center gap-0 p-4
                    border border-violet-400/20`}>

                  <CardContent className="h-full p-0 text-sm text-white/80 text-center
                  flex items-center gap-0">

                    <blockquote className="
                        relative
                        max-w-[350px]
                        mx-auto
                        flex flex-col gap-0
                        items-center
                        px-6
                        rounded-2xl
                        bg-violet-500/5
                        shadow-[0_0_40px_rgba(139,92,246,0.15)]
                      ">
                      {/* Quote Icon */}
                      <svg
                        className="w-10 h-10 text-violet-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 11V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4H5m14-6V8a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4h-1"
                        />
                      </svg>

                      {/* Main Quote */}
                      <p className="
                          text-base
                          text-white/85
                          leading-relaxed
                          font-medium
                        ">
                        Renderex began as a learning app and gradually grew into a software for
                        applying theory in practice, helping build real-world experience for a
                        future career in software development.
                      </p>

                      {/* Divider */}
                      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent 
                      via-violet-400/30 to-transparent" />

                      {/* Motivation Line */}
                      <span className="
                            block
                            text-xs
                            uppercase
                            tracking-[0.35em]
                            text-violet-300/80
                            text-center
                            font-mono
                          ">
                        Levels...
                      </span>
                    </blockquote>

                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default About
