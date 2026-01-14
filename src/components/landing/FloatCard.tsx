"use client"
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface FloatCardArgs {
  Icon: LucideIcon,
  title: string,
  subTitle: string,
  SubIcon: LucideIcon,
  absoluteClasses: string,
}

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

const FloatCard = ({ Icon, title, subTitle, SubIcon, absoluteClasses }: FloatCardArgs) => {

  const { scrollY } = useScroll();

  const yRange = useTransform(scrollY, [0, 200], [0, -200]);
  const y = useSpring(yRange, { stiffness: 10, damping: 10 }); // how fast the animation is
  // and how smooth it slows down

  return (
    <motion.div
      style={{ y }}
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full hidden md:block absolute ${absoluteClasses} p-4 rounded-xl 
          text-white`}
    >

      <Card className="w-full w-[250px] flex flex-row items-center p-4 justify-between gap-4 
  bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="p-0">
          <Icon className="w-14 h-14 text-main"></Icon>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col gap-1 items-start">
          <h2 className="text-white text-sm font-extrabold">{title}</h2>
          <div className="flex gap-1 items-center">
            <h3 className="text-white font-extralight opacity-30 text-sm text-nowrap">{subTitle}</h3>
            <SubIcon className="w-4 h-4 text-main"></SubIcon>
          </div>

        </CardContent>
        <CardFooter className="p-0 flex gap-1 items-center">

        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default FloatCard
