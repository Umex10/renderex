import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

interface AttributesCard {
  date: string,
  attribute: string
}

const AttributesCard = ({date, attribute}: AttributesCard) => {
  return (
    <Card className='w-full flex flex-row items-center justify-between p-4
            border border-white/20 shadow-xl rounded-2xl   bg-violet-400/10'>
                <CardHeader className='p-0'>
                  <CardTitle>{date}</CardTitle>
                </CardHeader>
                <CardFooter className='p-0'>
                 {attribute}
                </CardFooter>
              </Card>
  )
}

export default AttributesCard
