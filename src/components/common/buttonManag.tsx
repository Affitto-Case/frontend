import type { ColorType } from "@/types"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

export function ButtonManagment({
  title,
  color,
}: {
  title: string
  color: ColorType
}) {
  const colorClasses: Record<ColorType, string> = {
    blue: "bg-blue-500 text-white hover:bg-blue-500/80",
    green: "bg-green-500 text-white hover:bg-green-500/80",
    yellow: "bg-yellow-500 text-white hover:bg-yellow-500/80",
    purple: "bg-purple-500 text-white hover:bg-purple-500/80",
    pink: "bg-pink-500 text-white hover:bg-pink-500/80",
    red: "bg-red-500 text-white hover:bg-red-500/80",
  }

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full flex items-center justify-center p-6 h-auto border-2 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors",
        colorClasses[color]
      )}
    >
      <span className="font-medium">{title}</span>
    </Button>
  )
}

export default ButtonManagment
