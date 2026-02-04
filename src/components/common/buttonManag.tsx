import type { ColorType } from "@/types"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function ButtonManagment({
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
    blue: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    green: "bg-green-500 hover:bg-green-600 text-white border-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600",
    purple: "bg-purple-500 hover:bg-purple-600 text-white border-purple-600",
    pink: "bg-pink-500 hover:bg-pink-600 text-white border-pink-600",
    red: "bg-red-500 hover:bg-red-600 text-white border-red-600",
  }

  return (
    <Button
      variant="default"
      onClick={() => navigate(path)}
      className={cn(
        "w-full flex items-center justify-between p-6 h-24 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-1",
        colorClasses[color]
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5" />}
        <span className="font-bold text-lg">{title}</span>
      </div>
      <span className="text-xl opacity-80">→</span>
    </Button>
  )
}

export default ButtonManagment
