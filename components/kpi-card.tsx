import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, description }: KPICardProps) {
  const changeColor = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-cs-gray-400",
  }[changeType]

  return (
    <Card className="bg-cs-dark border-cs-gray-700 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-cs-gray-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-cs-blue" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-cs-white">{value}</div>
        {change && <p className={`text-xs ${changeColor} mt-1`}>{change}</p>}
        {description && <p className="text-xs text-cs-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
