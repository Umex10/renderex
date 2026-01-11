"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import { Bot, Loader, FileType, FileDown } from 'lucide-react';


export function SpotlightEffect() {
  const isMobile = useIsMobile();

  const { scrollY } = useScroll();

  const yRange = useTransform(scrollY, [0, 1000], [0, -100]);
  const y = useSpring(yRange, { stiffness: 40, damping: 5 });

  return (
    // Outer container: Covers full screen width with background color and grid
    <div className="h-full min-h-screen w-full flex items-center justify-center">

      {/* Inner container: This limits the Spotlight's reach. 
          Everything inside this box is constrained to 1280px (max-w-7xl).
      */}
      <div className="relative w-full max-w-7xl h-full min-h-screen 
      overflow-visible mx-auto flex md:items-center md:justify-center">

        {/* MAIN SPOTLIGHT 
            - Mobile: Light is moved more to the edge (xOffset: 150)
            - Desktop: Stronger violet color and more central positioning
        */}
        <Spotlight
          xOffset={isMobile ? 150 : 300}
          translateY={isMobile ? -100 : -300}
          duration={isMobile ? 8 : 6}
        // Stronger violet for desktop (0.35 opacity), subtle for mobile (0.2)
        />

        {/* SECONDARY SPOTLIGHT (Desktop Only)
            - Adds a second violet glow from the left for a balanced look
        */}
        {!isMobile && (
          <Spotlight
            xOffset={-60}
            translateY={-300}
            duration={7}
          />
        )}

        {/* HERO CONTENT */}
        {/* ANIMATED HERO CONTENT */}
        <motion.div
          className="relative z-10 w-full flex flex-col items-center justify-center pt-20 
          md:pt-0 md:pb-[35rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent
   bg-gradient-to-b from-purple-50 to-purple-400 bg-opacity-50 leading-tight">
            Write once. <br /> Think clearer.
          </h1>

          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            A focused markdown note editor with smart assistance. Capture thoughts, refine ideas,
            and let AI help you structure what matters.
          </p>
        </motion.div>

        <motion.div
          style={{ y }}
          className="absolute top-1/2 left-3/5 p-4 rounded-xl 
          text-white shadow-xl"
        >
          <Card className="w-full min-w-[250px] flex flex-row items-center p-4 justify-between gap-4 
  bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
          <CardHeader className="p-0">
            <Bot className="w-14 h-14 text-violet-400"></Bot>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col gap-1 items-start">
            <h2 className="text-sm font-extrabold">AI Markdown generation</h2>
            <div className="flex gap-1 items-center">
              <h3 className="font-extralight opacity-30 text-sm">Try again?</h3>
              <Loader className="w-4 h-4 text-violet-400"></Loader>
            </div>

          </CardContent>
          <CardFooter className="p-0 flex gap-1 items-center">

          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        style={{ y }}
        className="absolute top-2/3 left-1/5 p-4 rounded-xl 
          text-white shadow-xl"
      >
        <Card className="w-full min-w-[250px] flex flex-row items-center p-4
          justify-between gap-4 ">
          <CardHeader className="p-0">
            <FileDown className="w-14 h-14 text-violet-400"></FileDown>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col gap-1 items-start">
            <h2 className="text-sm font-extrabold">AI Markdown generation</h2>
            <div className="flex gap-1 items-center">
              <h3 className="font-extralight opacity-30 text-sm">Selected type: {" "}
                <span className="font-extrabold ">
                  .md
                </span>
              </h3>
              <FileType className="w-4 h-4 text-violet-400"></FileType>
            </div>

          </CardContent>
          <CardFooter className="p-0 flex gap-1 items-center">

          </CardFooter>
        </Card>
      </motion.div>
    </div>
    </div >
  );
}