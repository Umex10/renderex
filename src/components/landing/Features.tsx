"use client"
import React from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'

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
          <div className='grid grid-cols-2'>
            <Card className='p-4 bg-black'>
              <CardHeader>
                <CardTitle>Note Overview</CardTitle>
              </CardHeader>
              <CardContent>Each note in the sidebar shows its title, last edited date, and content snippet.
                Notes can be created, edited, or deleted, and each note has tags, which can be added or removed.
                Clicking a note opens the full Markdown editor for easy editing.
              </CardContent>
              <CardFooter className='flex justify-center'>
                <div className='relative'>
                  <Image
                    src="/notes2.png"
                    width={300}
                    height={150}
                    alt='Notes'
                    className='rounded-xl'>
                  </Image>

                  <span
                    className="absolute -top-10 bottom-0 -right-10 w-42 rounded-full
    bg-gradient-to-l from-black/100 via-black/70 to-black/30 blur-xl"
                    aria-hidden
                  />
                  <span
                    className="absolute -bottom-5 -left-10 -right-10 h-50 rounded-full
    bg-gradient-to-t from-black/100 via-black/70 to-black/30 blur-xl"
                    aria-hidden
                  />
                </div>

              </CardFooter>
            </Card>
            <Card className='p-4'>
              <CardHeader>
                <CardTitle>Saving/Generating states</CardTitle>
              </CardHeader>
              <CardContent>When the AI is processing a note, a clear loading state appears, e.g., “Generating…”,
                so you always know it’s working. Similarly, saving changes to a note shows a
                “Saving…” state, keeping your workflow smooth and transparent.
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <Card className='w-full p-4'>
            <CardHeader>
              <CardTitle>AI Sandbox with History</CardTitle>
            </CardHeader>
            <CardContent>The AI Sandbox lets you experiment with your note’s content safely.
              You can generate better outcomes, regenerate if the result isn’t right,
              and even go back to a later version at any step.
              Once satisfied, the updated content can be transferred back to the main note seamlessly.
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </div>


    </section>
  )
}

export default Features
