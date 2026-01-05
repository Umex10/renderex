import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { BadgeInfo } from 'lucide-react';

interface InfoToolArgs {
  desc: string
}

const InfoTool = ({desc}: InfoToolArgs) => {
  return (
    <Tooltip>
      <TooltipTrigger className='mt-2'>
        <BadgeInfo>
    
        </BadgeInfo>
      </TooltipTrigger>
      <TooltipContent>
        <p>{desc}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default InfoTool
