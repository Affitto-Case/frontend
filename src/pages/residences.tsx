import { useEffect, useState } from "react"
import type { Residence } from "@/types/index"
import TableResidence from "@/components/residence/table"
import CreateResidenceForm from "@/components/residence/formResidence"
import { toast } from "sonner"
import { Loader2, Building2, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function ResidenceManage() {
  const [residences, setResidences] = useState<Residence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchResidence, setSearchResidence] = useState("")
  const [open, setOpen] = useState(false)



  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    setIsLoading(true);
    const fetchResidences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/residences`)
        if (!res.ok) {
          throw new Error("Failed to fetch residences")
        }
        const residencesResp = await res.json();
        setResidences(residencesResp)
        toast.success("Data loaded successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchResidences();
  }, [])

  const handleResidenceDeleted = (residenceId: number) => {
    console.log("Residence deleted:", residenceId)
    setResidences(prevResidences =>
      prevResidences.filter(residence => residence.id !== residenceId)
    )
  }

  const handleResidenceUpdated = (updatedResidence: Residence) => {
    setResidences(prevResidences =>
      prevResidences.map(residence =>
        residence.id === updatedResidence.id ? updatedResidence : residence
      )
    )
  }

  const handleFormSubmit = (newResidence: Residence) => {
    setResidences(prev => [...prev, newResidence])
    setOpen(false)
  }

  const filteredResidences = residences.filter((r) =>
    r.name.toLowerCase().includes(searchResidence.toLowerCase()) ||
    r.address.toLowerCase().includes(searchResidence.toLowerCase()) ||
    r.hostName.toLowerCase().includes(searchResidence.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4 justify-between">
        <div className="flex items-center justify-center gap-4">
          <Building2 className="size-6" />
          <h1 className="text-2xl font-bold tracking-tight">Residence Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search residences..."
              value={searchResidence}
              onChange={(e) => setSearchResidence(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="size-4 mr-2" />
            Add Residence
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full bg-card rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableResidence
              residences={filteredResidences}
              onResidenceUpdated={handleResidenceUpdated}
              onResidenceDeleted={handleResidenceDeleted}
            />
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Residence</DialogTitle>
            <DialogDescription>
              Create a new residence entry in the system.
            </DialogDescription>
          </DialogHeader>
          <CreateResidenceForm onFormSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ResidenceManage