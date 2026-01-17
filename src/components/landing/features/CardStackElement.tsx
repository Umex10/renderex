import React from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LucideIcon } from 'lucide-react'

interface CardStackElementArgs {
  headerTitle: string,
  titleColor?: string
  Icon: LucideIcon,
  mainContent: string,
  footerContent: string,
  uniqueClasses: string
}

const CardStackElement = ({ headerTitle, titleColor, Icon, mainContent,
   footerContent, uniqueClasses }: CardStackElementArgs) => {
  return (
      <Card className={`absolute transform transition-all duration-500 
    rotate-y-[35deg] rotate-x-[-10deg] backface-visibility-hidden transform-gpu ${uniqueClasses}
    min-w-[300px] lg:min-w-[400px] md:h-42`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${titleColor}`}>
            <Icon className="h-5 w-5" />
            {headerTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {mainContent}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground font-mono">
          {footerContent}
        </CardFooter>
      </Card>
  )
}

export default CardStackElement
