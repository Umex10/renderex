"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function SpotlightEffect() {
  const isMobile = useIsMobile();

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
          className="relative z-10 w-full flex flex-col items-center justify-center pt-20 md:pt-0 md:pb-96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }} // Fade-In dauert 2 Sekunden
        >
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent
   bg-gradient-to-b from-purple-50 to-purple-400 bg-opacity-50 leading-tight">
            Write once. <br /> Think clearer.
          </h1>

          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            A focused note editor with smart assistance. Capture thoughts, refine ideas,
            and let AI help you structure what matters.
          </p>
        </motion.div>

      </div>
    </div>
  );
}