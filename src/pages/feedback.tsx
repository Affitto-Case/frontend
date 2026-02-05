import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CreateFeedbackForm } from "@/components/feedback/createFeedbackForm"
import { TableFeedback } from "@/components/feedback/table"
import { Loader2, MessageSquare, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Feedback } from "@/types"

const FeedbackManage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchFeedback, setSearchFeedback] = useState("")
  const [open, setOpen] = useState(false)
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

  const handleDelete = (id: number) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  const handleCreated = (newFeed: Feedback) => {
    setFeedbacks(prev => [...prev, newFeed]);
    setOpen(false)
  }

  const filteredFeedbacks = feedbacks.filter((f) =>
    f.comment.toLowerCase().includes(searchFeedback.toLowerCase()) ||
    f.title.toLowerCase().includes(searchFeedback.toLowerCase()) ||
    f.userFirstName.toLowerCase().includes(searchFeedback.toLowerCase()) ||
    f.residenceName.toLowerCase().includes(searchFeedback.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4 justify-between">
        <div className="flex items-center justify-center gap-4">
          <MessageSquare className="size-6" />
          <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search feedbacks..."
              value={searchFeedback}
              onChange={(e) => setSearchFeedback(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="size-4 mr-2" />
            Add Feedback
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full bg-card rounded-lg border-2 shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableFeedback
              feedbacks={filteredFeedbacks}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              Share your experience with a residence.
            </DialogDescription>
          </DialogHeader>
          <CreateFeedbackForm onCreated={handleCreated} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FeedbackManage