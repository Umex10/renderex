import React from 'react'

import { Spotlight } from "@/components/ui/spotlight-new";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const SpotlightEffect = () => {

  const isMobile = useIsMobile();

  return (
    <>
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
        className="z-10 w-full flex flex-col items-center justify-center pt-14
              md:-mt-[32rem]"
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
    </>
  )
}

export default SpotlightEffect
