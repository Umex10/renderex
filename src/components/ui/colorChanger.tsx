"use client"
import React from 'react'

interface ColorChangerArgs {
  color: string,
  handleColor: (color: string) => void;
}

const ColorChanger = ({color, handleColor}: ColorChangerArgs) => {

  return (
    <label
      className="relative w-2 h-2 rounded-full cursor-pointer flex items-center justify-center"
      style={{ backgroundColor: color }}
    >

      <span className="absolute inset-0 rounded-full ring-2 ring-white/100 ring-offset-2 ring-offset-black/10" />

      <input
        type="color"
        value={color}
        onChange={(e) => handleColor(e.currentTarget.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>
  )
}

export default ColorChanger
