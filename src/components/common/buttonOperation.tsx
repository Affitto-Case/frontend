import type { ColorType } from "@/types"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

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
      variant="ghost"
      onClick={() => navigate(path, { state: { themeColor: color } })}
      className={cn(
        "w-full group relative flex items-center justify-between p-6 h-24 rounded-xl border bg-card/50 backdrop-blur-sm text-left transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 hover:bg-card",
        colorClasses[color]
      )}
    >
      {/* Decorative colored bar on the left */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all duration-300 group-hover:w-2",
        colorClasses[color]
      )} />

      <div className="flex items-center gap-4 overflow-hidden">
        <div className={cn(
          "p-2 rounded-lg transition-colors duration-300",
          colorClasses[color]
        )}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <span className="font-semibold text-foreground whitespace-normal leading-tight">{title}</span>
      </div>

      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
        "group-hover:scale-110",
        colorClasses[color]
      )}>
        <ArrowRight/>
      </div>
    </Button>
  )
}

export default ButtonOperation;
