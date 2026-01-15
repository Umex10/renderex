"use client"
import React from 'react'
import Image from 'next/image'
import CardStackContainer from './CardStackContainer'
import FeatureCard from './FeatureCard'
import { motion } from "framer-motion";
import SandboxReduced from "./SanboxReduced"

const Features = () => {
  return (
    <section id="features" className='relative w-full h-full min-h-screen-header'>
      <div className='w-full flex flex-col items-center justify-center z-10'>
        <span
          className="absolute inset-[-350px] md:inset-[-230px] rounded-full
      bg-black/90 blur-xl"
          aria-hidden
        />
        <div className='z-10'>
          <h2 className="main-heading">
            Generative AI
          </h2>
          <p className="sub-context">
            Unlock your productivity: capture ideas, organize notes, and stay on top of everything—fast and smart.
          </p>
        </div>

        <div className='max-w-[1000px] p-4 flex flex-col z-10'>
          <div className='grid grid-cols-1 md:grid-cols-2'>
            <FeatureCard headerTitle='Note Overview'
              mainContent='Each note in the sidebar shows its title, last edited date, and content snippet.
                Notes can be created, edited, or deleted, and each note has tags, which can be added or removed.
                Clicking a note opens the full Markdown editor for easy editing.'
              footerContent={<div className='w-full flex justify-center'>
                <div className='relative'>
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
                    className="inline-block rounded-lg"
                  >
                    <Image
                      src="/notes2.png"
                      width={300}
                      height={150}
                      alt="Notes"
                      className="rounded-lg"
                    />
                  </motion.div>


                  <span
                    className="absolute -top-10 bottom-0 -right-10 w-42 rounded-full
    bg-gradient-to-l from-black/100 via-black/70 to-black/40 blur-xl"
                    aria-hidden
                  />
                  <span
                    className="absolute -bottom-5 -left-10 -right-10 h-90
    bg-gradient-to-t from-black/100 via-black/60 to-black/30 blur-sm"
                    aria-hidden
                  />
                </div>
              </div>
              }></FeatureCard>
            <FeatureCard headerTitle='AI-Driven Modes'
              mainContent='Each note comes with multiple AI modes – for example, the Summary Mode
                automatically generates a concise overview, the Structure Mode organizes your
                content clearly, and the Sandbox Mode lets you try out multiple AI
                generations.'
              footerContent={<CardStackContainer></CardStackContainer>}></FeatureCard>
          </div>

          <FeatureCard headerTitle='AI Sandbox with History'
            mainContent='The AI Sandbox lets you try out your note’s content safely.
              You can generate better outcomes, regenerate if the result isn’t right,
              and even go back to a later version at any step.
              Once satisfied, the updated content can be transferred back to the main note seamlessly.'
            footerContent={<SandboxReduced></SandboxReduced>}></FeatureCard>
        </div>
      </div>


    </section>
  )
}

export default Features
