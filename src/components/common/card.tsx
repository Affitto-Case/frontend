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

export function CardStats({ title, stats, color, icon: Icon }: { title: string; stats: number | null; color: ColorType; icon?: any }) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 h-32 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${colorClasses[color]}`} />}
      </CardHeader>
      <CardContent>
        {stats !== null ? (
          <div className="text-2xl font-bold">{stats}</div>
        ) : (
          <div className="text-sm text-muted-foreground">Overview</div>
        )}
      </CardContent>
    </Card>
  )
}