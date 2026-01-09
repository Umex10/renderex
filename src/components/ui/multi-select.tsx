"use client"
import { X, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Tag } from "../../types/tag";

interface MultiSelectProps {
  items: Tag[]
  selected: Tag[]
  onChange: (selected: Tag[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({ items, selected, onChange, placeholder = "Choose...", className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleUnselect = (tag: Tag) => {
    const newSelected = selected.filter((selectedTag) => selectedTag.name !== tag.name)
    onChange(newSelected)
  }

  const handleSelect = (tag: Tag) => {
    let newSelected: Tag[]
    if (selected.includes(tag)) {
      newSelected = selected.filter((selectedTag) => selectedTag.name !== tag.name)
    } else {
      newSelected = [...selected, tag]
    }
    onChange(newSelected)
  }

  return (
    <div className={cn("relative max-w-[150px] z-[60]", className)}>
      <Button type="button" variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between">
        <span className="text-muted-foreground">
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="
      absolute left-0 top-full z-[60] mt-2
      w-full rounded-md border border-input bg-background
    ">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 border-b">
              {selected.map((selectedTag) => (
                <Badge key={selectedTag.name} variant="secondary" className="gap-1">
                  {selectedTag.name}
                  <button
                    className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onClick={() => handleUnselect(selectedTag)}
                    type="button"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {items.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">No options available</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {items.map((item) => {
                const isSelected = selected.includes(item)
                return (
                  <label
                    key={item.name}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelect(item)}
                        className="h-4 w-4 rounded border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                    </div>
                    <span className="text-sm">{item.name.charAt(0).toUpperCase() +
                  item.name.slice(1,)}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
