"use client"

import { LucideIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './../ui/button'
import ColorChanger from './../ui/colorChanger'
import { Tag } from "../../types/tag";
import { Badge } from './../ui/badge'

interface TagArgs {
  tag: Tag,
  Icon: LucideIcon,
  handleDeleteUserTag: (tag: Tag) => void,
  handleEditUserTag: (tag: Tag, tagColor: string) => void,
  handleEditedColorNotes: (tag: Tag, tagColor: string) => void,
  noColorChange?: boolean
}

const SingleTag = ({tag, Icon, handleDeleteUserTag, handleEditUserTag,
  handleEditedColorNotes, noColorChange = false}: TagArgs) => {

    const [tagColor, setTagColor] = useState<string>(tag.color);

    function handleColor(color: string) {
      setTagColor(color)
    }

    useEffect(() => {

      const timeout = setTimeout(() => {
        
        if (tag.color === tagColor) return;
        handleEditUserTag(tag, tagColor);
        handleEditedColorNotes(tag, tagColor);

      }, 500)

      return () => clearTimeout(timeout);
    }, [tagColor, tag.name])

  return (
    <Badge key={tag.name} variant="outline" className={`flex gap-3`}
                style={{ backgroundColor: tagColor }}
                data-testid="usertag">
                <span className='text-sm'>{tag.name.charAt(0).toUpperCase() +
                  tag.name.slice(1,)}</span>
                <Button className="w-4 h-4 p-2 rounded-full"
                  onClick={() => handleDeleteUserTag(tag)}
                  data-testid="delete-tag-button">
                  <Icon className='w-4 h-4'></Icon>
                </Button>

                {!noColorChange && (
                   <ColorChanger color={tagColor} handleColor={handleColor}></ColorChanger>
                )}
              
              </Badge>
  )
}

export default SingleTag
