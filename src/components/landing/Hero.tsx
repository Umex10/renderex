
import React from "react";
import { Bot, Loader, FileDown } from 'lucide-react';
import FloatCard from "./FloatCard";
import SpotlightEffect from "./SpotlightEffect";
import Image from "next/image";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/shared/use-mobile";

export function Hero() {

  const isMobile = useIsMobile();

  return (
    // Outer container: Covers full screen width with background color and grid
    <section id="hero"
      className="h-full w-full flex items-center justify-center
     min-h-screen-header">

      {/* Inner container: This limits the Spotlight's reach. 
          Everything inside this box is constrained to 1280px (max-w-7xl).
      */}
      <div className="relative w-full max-w-7xl h-full min-h-screen 
      overflow-visible mx-auto flex flex-col md:items-center md:justify-center">

        <SpotlightEffect></SpotlightEffect>

        <motion.div
          className=" flex justify-center perspective-[2000px]"
          initial={{
            opacity: 0,        // start fully transparent
            x: 40,             // start 40px to the right
            y: -60,            // start 60px above          
            rotateX: 20,       // start rotated 20deg around X-axis (tilt forward/back)
            rotateY: 10,       // start rotated 10deg around Y-axis (tilt left/right)
            rotateZ: -20,      // start rotated -20deg around Z-axis (2D spin)
          }}
          whileInView={{
            opacity: 1,        // fade in to fully visible
            x: 100,            // move to final X position
            y: isMobile ? 70 : 20,  // move to final Y position     
            rotateX: 40,       // rotate to final X angle
            rotateY: 30,       // rotate to final Y angle
            rotateZ: -30,      // rotate to final Z angle
          }}
          viewport={{
            once: true,        // animate only once when in viewport
            margin: "-100px",  // trigger slightly before the element fully enters view
          }}
          transition={{
            duration: 1.4,                 // total animation duration in seconds
            ease: [0.22, 1, 0.36, 1],      // custom cubic-bezier easing (smooth cinematic)
          }}
        >
          <Image
            src="/landing.png"
            width={3000}
            height={1600}
            alt="Renderex's Core"
            className="transform 
                translate-x-[40px] translate-z-[1000px] 
                md:translate-x-[0px] md:translate-z-[500px]
               shadow-2xl shadow-[0_10px_20px_rgba(160,50,200,0.4)] rounded-lg"
          />
        </motion.div>

        <FloatCard Icon={Bot} title="AI generation"
          subTitle="Try again?" SubIcon={Loader}
          absoluteClasses="top-2/6 left-3/5"></FloatCard>

        <FloatCard Icon={FileDown} title="Download note"
          subTitle="Type: .md" SubIcon={Loader}
          absoluteClasses="top-5/7 left-1/5"></FloatCard>
      </div>
    </section >
  );
}