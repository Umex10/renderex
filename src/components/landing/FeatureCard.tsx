"use client"

import { motion } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface FeatureCardArgs {
  headerTitle: string,
  mainContent: string,
  footerContent: string | React.ReactNode,
}

const FeatureCard = ({headerTitle, mainContent, footerContent}: FeatureCardArgs) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <Card className="p-4 bg-black">
        <CardHeader>
          <CardTitle>{headerTitle}</CardTitle>
        </CardHeader>

        <CardContent>
          {mainContent}
        </CardContent>

        <CardFooter>
          {footerContent}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default FeatureCard
