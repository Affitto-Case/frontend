import { colorClasses, type ColorType } from "@/types"
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
  const theme = colorClasses[color]

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(path, { state: { themeColor: color } })}
      className={cn(
        "w-full group relative flex items-center justify-between p-6 h-24 rounded-xl border bg-card/50 backdrop-blur-sm text-left transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 hover:bg-card",
        theme.border
      )}
    >
      {/* Decorative colored bar on the left */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all duration-300 group-hover:w-2",
        theme.button.split(" ")[0] // Extract bg color from button theme
      )} />

      <div className="flex items-center gap-4 overflow-hidden">
        <div className={cn(
          "p-2 rounded-lg transition-colors duration-300",
          theme.bg,
          theme.icon
        )}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <span className="font-semibold text-foreground whitespace-normal leading-tight">{title}</span>
      </div>

      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
        "group-hover:scale-110",
        theme.border,
        theme.icon
      )}>
        <span className="text-xl">→</span>
      </div>
    </Button>
  )
}

export default ButtonOperation;
