"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar } from "./calendar-rac"

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  label?: string
  name?: string
  id?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  name,
  id,
  required,
  disabled,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
    }
  }, [value])

  const handleSelect = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = date.toISOString().split("T")[0]
    onChange?.(formattedDate)
    setOpen(false)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 18) // Must be at least 18 years old

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label} {required && "*"}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDate(selectedDate) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(date) => date > maxDate || date > new Date()}
          />
        </PopoverContent>
      </Popover>
      <input
        type="hidden"
        name={name}
        id={id}
        value={value || ""}
        required={required}
      />
    </div>
  )
}
