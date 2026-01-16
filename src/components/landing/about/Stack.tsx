'use client';

import React from 'react';
import {
  SiRedux

} from "react-icons/si";

import { TbBrandNextjs } from "react-icons/tb";
import { FaMarkdown, FaReact } from "react-icons/fa";
import { RiGeminiLine, RiTailwindCssLine } from "react-icons/ri";
import { SiShadcnui } from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";
import { SiTypescript } from "react-icons/si";
import { SiLucide } from "react-icons/si";

import { Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/shadcn-io/marquee';

// 1. Konfiguration außerhalb der Komponente (Saubere Trennung)
const TECH_STACK = [
  { Icon: TbBrandNextjs, name: 'NextJS' },
  { Icon: FaReact, name: 'React' },
  { Icon: RiTailwindCssLine, name: 'Tailwind' },
  { Icon: SiRedux, name: 'Redux' },
  { Icon: RiGeminiLine, name: 'Gemini' },
  { Icon: FaMarkdown, name: 'Markdown' },
  { Icon: SiShadcnui, name: 'Shadcn' },
  { Icon: IoLogoFirebase, name: 'Firebase' },
  { Icon: SiTypescript, name: 'Ts' },
  { Icon: SiLucide, name: 'Lucide' },
];

export function Stack() {
  return (
    <div className="group relative w-full overflow-hidden flex flex-col gap-3">
      {/* 1. "Längerer" Mask-Effekt: 
        Von 0% bis 30% wird eingeblendet, von 70% bis 100% ausgeblendet.
        Das erzeugt einen sehr weichen, luxuriösen Übergang.
      */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]">
        <Marquee className="gap-2">
          <MarqueeContent>
            {TECH_STACK.map(({ Icon, name }) => (
              <MarqueeItem key={name} className="px-4">
                <div className="
      relative flex h-16 w-16 items-center justify-center rounded-2xl 
      border border-white/10 bg-white/5 backdrop-blur-xl 
      /* --- HIER SIND DIE SCHATTEN-UPDATES --- */
      shadow-[0_110px_20px_rgba(0,0,0,0.5),0_6px_6px_rgba(0,0,0,0.5)] 
      transition-all duration-300 
      hover:scale-110 hover:bg-violet-400/15 hover:shadow-[0_110px_40px_rgba(0,0,0,0.7)]
      after:absolute after:inset-0 after:rounded-2xl 
      after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
    ">
                  <Icon width={64} height={64} className="w-8 h-8 text-white/90 drop-shadow-md" />
                </div>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>

      <div className="[mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]">
        <Marquee className="gap-2">
          <MarqueeContent  direction="right">
            {TECH_STACK.map(({ Icon, name }) => (
              <MarqueeItem key={name} className="px-4">
                <div className="group relative flex h-20 w-32 items-center justify-center rounded-xl 
      border border-white/10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md 
      shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20">

                  {/* Subtiler Glow im Hintergrund */}
                  <div className="absolute inset-0 z-0 bg-blue-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <h3 className="relative z-10 text-xs font-bold tracking-[0.2em] uppercase 
                 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent
                 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {name}
                  </h3>
                </div>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </div>
  );
}