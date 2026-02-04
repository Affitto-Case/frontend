import type { ColorType } from "@/types"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function ButtonOperation({
  title,
  color,
  path,
  icon: Icon
}: {
  title: string
  color: ColorType
  path: string
  icon?: any
}) {
  const navigate = useNavigate()

  const colorClasses: Record<ColorType, string> = {
    blue: "hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-600",
    green: "hover:border-green-500/50 hover:bg-green-500/10 text-green-600",
    yellow: "hover:border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-600",
    purple: "hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-600",
    pink: "hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-600",
    red: "hover:border-red-500/50 hover:bg-red-500/10 text-red-600",
  }

  return (
    <Button
      variant="outline"
      onClick={() => navigate(path)}
      className={cn(
        "w-full flex items-center justify-between p-6 h-24 rounded-lg border-2 bg-card text-left transition-all hover:shadow-md",
        colorClasses[color]
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <span className="font-medium text-foreground whitespace-normal text-left">{title}</span>
      </div>
      <span className="text-xl opacity-50 flex-shrink-0 ml-2">→</span>
    </Button>
  )
}
