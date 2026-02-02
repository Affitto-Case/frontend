import type { ColorType } from "@/types"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function ButtonOperation({
  title,
  color,
  path,
}: {
  title: string
  color: ColorType
  path: string
}) {
  const navigate = useNavigate()

  const colorClasses: Record<ColorType, string> = {
    blue: "hover:border-blue-500/50 hover:bg-blue-500/10",
    green: "hover:border-green-500/50 hover:bg-green-500/10",
    yellow: "hover:border-yellow-500/50 hover:bg-yellow-500/10",
    purple: "hover:border-purple-500/50 hover:bg-purple-500/10",
    pink: "hover:border-pink-500/50 hover:bg-pink-500/10",
    red: "hover:border-red-500/50 hover:bg-red-500/10",
  }

  const arrowColors: Record<ColorType, string> = {
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
    red: "text-red-500",
  }

  return (
    <Button
      variant="outline"
      onClick={() => navigate(path)}
      className={cn(
        "w-full flex items-center justify-between p-6 h-auto rounded-lg border-2 bg-card text-left text-foreground border-border transition-colors",
        colorClasses[color]
      )}
    >
      <span className="font-medium">{title}</span>
      <span className={cn("text-xl", arrowColors[color])}>→</span>
    </Button>
  )
}
