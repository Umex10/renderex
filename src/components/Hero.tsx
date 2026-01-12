
import React from "react";
import { Bot, Loader, FileDown } from 'lucide-react';
import FloatCard from "./FloatCard";
import SpotlightEffect from "./SpotlightEffect";


export function Hero() {


  return (
    // Outer container: Covers full screen width with background color and grid
    <section id="hero" 
     className="h-full min-h-screen w-full flex items-center justify-center">

      {/* Inner container: This limits the Spotlight's reach. 
          Everything inside this box is constrained to 1280px (max-w-7xl).
      */}
      <div className="relative w-full max-w-7xl h-full min-h-screen 
      overflow-visible mx-auto flex flex-col md:items-center md:justify-center">

       <SpotlightEffect></SpotlightEffect>

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