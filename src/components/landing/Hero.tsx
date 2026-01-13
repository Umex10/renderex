
import React from "react";
import { Bot, Loader, FileDown } from 'lucide-react';
import FloatCard from "./FloatCard";
import SpotlightEffect from "./SpotlightEffect";
import Image from "next/image";


export function Hero() {


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

        <div className="relative mt-90 flex justify-center perspective-[2000px]">
      
          <Image
            src="/landing.png"
            width={3000}
            height={1600}
            alt="Renderex's Core"
            className="transform rotate-x-[30deg] rotate-z-[-30deg] rotate-y-[20deg] 
               translate-z-[500px] translate-x-[150px] translate-y-[-250px]
               shadow-2xl shadow-[0_10px_20px_rgba(160,50,200,0.4)] rounded-lg"
          />
        </div>

        <FloatCard Icon={Bot} title="AI generation"
          subTitle="Try again?" SubIcon={Loader}
          absoluteClasses="top-1/2 left-3/5"></FloatCard>

        <FloatCard Icon={FileDown} title="Download note"
          subTitle="Type: .md" SubIcon={Loader}
          absoluteClasses="top-2/3 left-1/5"></FloatCard>
      </div>
    </section >
  );
}