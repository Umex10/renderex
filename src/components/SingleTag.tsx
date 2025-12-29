"use client"

import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import ColorChanger from './ui/colorChanger'
import { Tag } from '../../redux/slices/tags/tagsSlice'
import { Badge } from './ui/badge'

interface TagArgs {
  tag: Tag,
  Icon: LucideIcon,
  handleTag: (tag: Tag) => void;
}

const SingleTag = ({tag, Icon, handleTag}: TagArgs) => {

    const [tagColor, setTagColor] = useState(tag.color);

    function handleColor(color: string) {
      setTagColor(color)
    }

  return (
    <Badge key={tag.name} variant="outline" className={`flex gap-3`}
                style={{ backgroundColor: tagColor }}>
                <span className='text-sm'>{tag.name.charAt(0).toUpperCase() +
                  tag.name.slice(1,)}</span>
                <Button className="w-4 h-4 p-2 rounded-full"
                  onClick={() => handleTag(tag)}>
                  <Icon className='w-4 h-4'></Icon>
                </Button>
               <ColorChanger color={tagColor} handleColor={handleColor}></ColorChanger>
              </Badge>
  )
}

export default SingleTag
