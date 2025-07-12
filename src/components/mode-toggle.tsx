"use client"

import { Button } from "@/components/ui/button"
import { useMetaColor } from "@/hooks/use-meta-colors"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback, useEffect } from "react"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor, metaColor } = useMetaColor()

  useEffect(() => {
    setMetaColor(metaColor)
  }, [metaColor, setMetaColor])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme => resolvedTheme === "dark" ? "light" : "dark")
  }, [setTheme, resolvedTheme])

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="size-8 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-none transition-all">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
