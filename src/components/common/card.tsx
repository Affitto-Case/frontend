import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ColorType } from "@/types"


const colorClasses: Record<ColorType, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  red: "text-red-600"
}

export function CardStats({title, stats,color} : {title: string, stats: number | null,color: ColorType}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <h2 className={`text-3xl font-bold ${colorClasses[color]}`}>{stats}</h2>
      </CardContent>
    </Card>
  )
}