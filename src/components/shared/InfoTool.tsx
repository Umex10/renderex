import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface InfoToolArgs {
  desc: string,
  children: React.ReactNode,
  triggerClasses?: string
}

const InfoTool = ({desc, children, triggerClasses}: InfoToolArgs) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild className={`${triggerClasses}`}>
          {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{desc}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default InfoTool
