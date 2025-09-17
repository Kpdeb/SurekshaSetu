"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("[v0] Theme toggle mounted. Current theme:", theme, "Resolved theme:", resolvedTheme)
  }, [theme, resolvedTheme])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent" disabled>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark"
    console.log("[v0] Theme toggle clicked. Current:", resolvedTheme, "Setting to:", newTheme)
    setTheme(newTheme)
  }

  return (
    <Button variant="outline" size="icon" onClick={handleToggle} className="h-9 w-9 bg-transparent">
      <Sun className={`h-4 w-4 transition-all ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
