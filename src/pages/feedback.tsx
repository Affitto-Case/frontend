import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"
import { CreateFeedbackForm } from "@/components/feedback/createFeedbackForm"
import { TableFeedback } from "@/components/feedback/table"
import { Loader2, MessageSquare } from "lucide-react"
import type { Feedback, ColorType } from "@/types"
import { colorClasses } from "@/types"
import { cn } from "@/lib/utils"

const FeedbackManage = ({ color: defaultColor }: { color?: ColorType }) => {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL



  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/feedbacks`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setFeedbacks(data)
      } catch (error) {
        toast.error("Failed to fetch feedbacks")
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeedbacks()
  }, [])

  const handleCreated = (newFeed: Feedback) => {
    setFeedbacks(prev => [...prev, newFeed]);
  }

  const handleDelete = (id: number) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <MessageSquare className={cn("size-6", theme.icon)} />
        <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={cn("lg:col-span-4 rounded-xl border-2 p-1", theme.border)}>
          <CreateFeedbackForm onCreated={handleCreated} color={themeColor} />
        </div>

        <div className={cn("lg:col-span-8 bg-white rounded-lg border-2 shadow-sm", theme.border)}>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableFeedback
              feedbacks={feedbacks}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackManage