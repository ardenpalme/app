"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DateTimePicker({
  currDate,
  onChange,
} : {
  currDate : Date
  onChange?: (date: Date | undefined) => void;
}) {
  const [hours, setHours] = React.useState(currDate.getHours().toString().padStart(2, "0"))
  const [minutes, setMinutes] = React.useState(currDate.getMinutes().toString().padStart(2, "0"))

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      onChange?.(newDateTime)
    }
  }

  const handleHoursChange = (value: string) => {
    const numValue = Number.parseInt(value) || 0
    if (numValue >= 0 && numValue <= 23) {
      const formattedHours = numValue.toString().padStart(2, "0")
      setHours(formattedHours)
      handleTimeChange(formattedHours, minutes)
    }
  }

  const handleMinutesChange = (value: string) => {
    const numValue = Number.parseInt(value) || 0
    if (numValue >= 0 && numValue <= 59) {
      const formattedMinutes = numValue.toString().padStart(2, "0")
      setMinutes(formattedMinutes)
      handleTimeChange(hours, formattedMinutes)
    }
  }

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const newDateTime = new Date(currDate)
    newDateTime.setHours(Number.parseInt(newHours) || 0, Number.parseInt(newMinutes) || 0)
    onChange?.(newDateTime)
  }

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild className="cursor-pointer">
        <div className="w-full justify-start text-left font-normal">
          <Button type="button" variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(currDate, "PPP HH:mm")}
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"            // place above the trigger
        align="start"         // or "center"
        sideOffset={8}        // gap between trigger and content
        avoidCollisions={false} // <-- prevent Radix from flipping to bottom
        className="z-[1000] flex items-center justify-center"
      >
        <div className="flex flex-col">
          <Calendar 
            mode="single" 
            selected={currDate} 
            onSelect={handleDateChange}
            className="rounded-md border shadow-sm"
          />
          <div className="flex items-end flex-row gap-4 mx-auto py-2">
              <Label className="text-sm font-medium mb-2 block">Time</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => handleHoursChange(e.target.value)}
                    className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="HH"
                    min="0"
                    max="23"
                  />
                  <span className="text-sm text-muted-foreground">:</span>
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => handleMinutesChange(e.target.value)}
                    className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="MM"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>
          </div>
      </PopoverContent>
    </Popover>
  )
}



