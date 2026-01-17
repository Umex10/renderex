"use client"

import React, { useState, useEffect } from 'react'
import CardStackElement from './CardStackElement'
import { ListTree, Sparkles, FlaskConical } from "lucide-react";
import { useIsMobile } from '@/hooks/shared/use-mobile';

const CardStackContainer = () => {

 
  const isMobile = useIsMobile();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Static Data
  const cardContent = [
    { id: 'summary', title: 'Summary Mode', color: 'text-yellow-500', icon: Sparkles, main: 'Generates a concise summary...', footer: 'Perfect for quick understanding' },
    { id: 'structure', title: 'Structure Mode', color: 'text-red-500', icon: ListTree, main: 'Generates a concise structure...', footer: 'Designed for clarity & readability' },
    { id: 'sandbox', title: 'Sandbox Mode', color: 'text-violet-500', icon: FlaskConical, main: 'Try the AI Sandbox...', footer: 'Explore ideas without limits' }
  ];

  // Static Positions: Only the styles
  // The first style in this array is ALWAYS the front card (no blur, full opacity)
  const positions = [
    {
      // FRONT CARD: No blur, full opacity, special shadow, NO hover effect needed
      classes: 'translate-x-0 translate-y-0 translate-z-0 opacity-100 shadow-2xl shadow-violet-500/20 border-violet-500/50 z-30'
    },
    {
      // MIDDLE CARD: Slight blur, half opacity
      classes: '-translate-x-8 -translate-y-8 md:-translate-x-10 md:-translate-y-10 translate-z-[-50px] opacity-70 blur-[0.5px] z-20 hover:translate-z-0 hover:opacity-100 hover:blur-none hover:translate-y-[-200px]'
    },
    {
      // BACK CARD: More blur, low opacity
      classes: '-translate-x-16 -translate-y-16 md:-translate-x-20 md:-translate-y-20 translate-z-[-100px] opacity-40 blur-[1px] z-10 hover:translate-z-0 hover:opacity-100 hover:blur-none hover:translate-y-[-220px]'
    }
  ];

  useEffect(() => {
    // We will deactive the animation for Desktop
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cardContent.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="relative h-[300px] md:h-[350px] transform translate-x-[35px]
    md:translate-x-[50px]
     lg:translate-x-[60px] w-full flex items-center justify-center perspective-[1500px]">
      {cardContent.map((content, i) => {
        // This math ensures that the "content" rotates through the fixed "positions"
        const posIdx = (i + currentIndex) % cardContent.length;
        const currentStyle = positions[posIdx].classes;

        return (
          <CardStackElement
            key={content.id}
            headerTitle={content.title}
            titleColor={content.color}
            Icon={content.icon}
            mainContent={content.main}
            footerContent={content.footer}
            // We apply only the dynamic style and the base transition
            uniqueClasses={`${currentStyle} transition-all duration-700 ease-in-out`}
          />
        );
      })}
    </div>
  );
}

export default CardStackContainer;