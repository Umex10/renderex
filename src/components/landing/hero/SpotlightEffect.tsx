import React from 'react'

import { Spotlight } from "@/components/ui/spotlight-new";
import { useIsMobile } from "@/hooks/shared/use-mobile";
import { motion } from "framer-motion";

const SpotlightEffect = () => {

  const isMobile = useIsMobile();

  return (
    <div className='z-10'>
      {/* MAIN SPOTLIGHT 
       - Mobile: Light is moved more to the edge (xOffset: 150 | 300)
       */}
      <Spotlight
        xOffset={isMobile ? 150 : 300}
        translateY={isMobile ? -100 : -300}
        duration={isMobile ? 8 : 6}
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
        className="relative z-10 w-full flex flex-col items-center justify-center pt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >

        <h1 className="relative main-heading z-20">
          Write once. <br /> Think clearer.
        </h1>

        <p className="sub-context z-20">
          A focused markdown note editor with smart assistance. Capture thoughts, refine ideas,
          and let AI help you structure what matters.
        </p>
      </motion.div>
    </div>
  )
}

export default SpotlightEffect


