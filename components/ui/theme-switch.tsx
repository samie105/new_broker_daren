"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeSwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  checked?: boolean
}

const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  ThemeSwitchProps
>(({ className, checked, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      checked 
        ? "bg-primary/20" 
        : "bg-primary/10",
      className
    )}
    checked={checked}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    >
      {checked ? (
        <Moon className="h-3 w-3 text-slate-800 dark:text-slate-200" />
      ) : (
        <Sun className="h-3 w-3 text-amber-500" />
      )}
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
ThemeSwitch.displayName = "ThemeSwitch"

export { ThemeSwitch } 