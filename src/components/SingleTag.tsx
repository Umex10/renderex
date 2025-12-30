"use client"

import { LucideIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import ColorChanger from './ui/colorChanger'
import { editColor, Tag } from '../../redux/slices/tags/tagsSlice'
import { Badge } from './ui/badge'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'

interface TagArgs {
  tag: Tag,
  Icon: LucideIcon,
  handleTag: (tag: Tag) => void,
  noColorChange?: boolean
}

const SingleTag = ({tag, Icon, handleTag, noColorChange = false}: TagArgs) => {

    const [tagColor, setTagColor] = useState(tag.color);
    const dispatch = useDispatch<AppDispatch>();
   

    function handleColor(color: string) {
      setTagColor(color)
    }

    useEffect(() => {

      console.log("New Color:", tagColor)
      const timeout = setTimeout(() => {
              dispatch(editColor({ tagName: tag.name, newColor: tagColor }));
      }, 500)

      return () => clearTimeout(timeout);
    }, [tagColor, tag.name, dispatch])

  return (
    <Badge key={tag.name} variant="outline" className={`flex gap-3`}
                style={{ backgroundColor: tagColor }}>
                <span className='text-sm'>{tag.name.charAt(0).toUpperCase() +
                  tag.name.slice(1,)}</span>
                <Button className="w-4 h-4 p-2 rounded-full"
                  onClick={() => handleTag(tag)}>
                  <Icon className='w-4 h-4'></Icon>
                </Button>

                {!noColorChange && (
                   <ColorChanger color={tagColor} handleColor={handleColor}></ColorChanger>
                )}
              
              </Badge>
  )
}

export default SingleTag
