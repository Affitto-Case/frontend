import { colorClasses, type ColorType } from "@/types"
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

  return (
    <Button
      variant="default"
      onClick={() => navigate(path, { state: { themeColor: color } })}
      className={cn(
        "w-full flex items-center justify-between p-6 h-24 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-1",
        colorClasses[color].button
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
