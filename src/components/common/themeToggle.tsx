import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">🌞</span>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(value) =>
          setTheme(value ? "dark" : "light")
        }
      />
      <span className="text-sm">🌙</span>
    </div>
  )
}

export default ThemeToggle
