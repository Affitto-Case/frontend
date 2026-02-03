import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CreateFeedbackForm } from "@/components/feedback/createFeedbackForm"
import { TableFeedback } from "@/components/feedback/table"
import { Loader2, MessageSquare } from "lucide-react"
import type { Feedback } from "@/types"

const FeedbackManage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL

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

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleCreated = () => {
    fetchFeedbacks()
  }

  const handleDelete = (id: number) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <MessageSquare className="size-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <CreateFeedbackForm onCreated={handleCreated} />
        </div>

        <div className="lg:col-span-8 bg-white rounded-lg border shadow-sm">
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