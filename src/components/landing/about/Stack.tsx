'use client';

import React from 'react';
import {
  FigmaLogoIcon, FramerLogoIcon, SketchLogoIcon, TwitterLogoIcon,
  GitHubLogoIcon, VercelLogoIcon, NotionLogoIcon, DiscordLogoIcon,
  InstagramLogoIcon, LinkedInLogoIcon
} from "@radix-ui/react-icons";
import { Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/shadcn-io/marquee';

const TECH_STACK = [
  { Icon: FigmaLogoIcon, name: 'Figma' },
  { Icon: FramerLogoIcon, name: 'Framer' },
  { Icon: SketchLogoIcon, name: 'Sketch' },
  { Icon: TwitterLogoIcon, name: 'Twitter' },
  { Icon: GitHubLogoIcon, name: 'GitHub' },
  { Icon: VercelLogoIcon, name: 'Vercel' },
  { Icon: NotionLogoIcon, name: 'Notion' },
  { Icon: DiscordLogoIcon, name: 'Discord' },
  { Icon: InstagramLogoIcon, name: 'Instagram' },
  { Icon: LinkedInLogoIcon, name: 'LinkedIn' },
];

export function Stack() {
  return (
    // Grundfarbe des Containers auf fast Schwarz gesetzt für bessere Integration
    <div className="group relative w-full overflow-hidden py-10 bg-[#050505]">

      {/* --- NEU: Linker schwarzer Schatten-Overlay --- */}
      {/* 'pointer-events-none' ist wichtig, damit man durch den Schatten hindurch hovern kann */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[35%] bg-gradient-to-r from-black via-black/80 to-transparent"></div>

      {/* --- NEU: Rechter schwarzer Schatten-Overlay --- */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[35%] bg-gradient-to-l from-black via-black/80 to-transparent"></div>

      {/* Die Maske darunter sorgt für einen weichen Auslauf der Icons selbst.
         Ich habe sie etwas verbreitert (20%-80%), damit sie gut mit den Overlays zusammenspielt.
      */}
      <div className="relative z-0 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <Marquee className="gap-4">
          <MarqueeContent>
            {TECH_STACK.map(({ Icon, name }) => (
              <MarqueeItem key={name} className="px-2">
                <div className="
                  relative flex h-16 w-16 items-center justify-center rounded-2xl 
                  border border-white/10 bg-white/5 backdrop-blur-md
                  shadow-[0_8px_16px_rgb(0_0_0/0.4)]
                  transition-all duration-300 
                  hover:scale-110 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_12px_24px_rgb(0_0_0/0.6)]
                ">
                  <Icon width={32} height={32} className="text-white/80 drop-shadow-sm transition-colors group-hover:text-white" />
                </div>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </div>
  );
}