import { useEffect, useState } from "react"
import type { Residence } from "@/types/index"
import TableResidence from "@/components/residence/table"
import CreateResidenceForm from "@/components/residence/formResidence"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ResidenceManage() {
  // Stato tipizzato correttamente come array di Residence
  const [residences, setResidences] = useState<Residence[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handleFormSubmit = (data: Residence) => {
    console.log("Residence created:", data)
    const newResidence: Residence = {
      ...data,
    }

    setResidences(prevResidences => [...prevResidences, newResidence])
  }

  const handleResidenceUpdated = (updatedResidence: Residence) => {
    console.log("Residence updated:", updatedResidence)

    // Aggiorna il residence nella lista cercando per residenceId
    setResidences(prevResidences =>
      prevResidences.map(residence =>
        residence.id === updatedResidence.id
          ? { ...updatedResidence }
          : residence
      )
    )
  }

  const handleResidenceDeleted = (residenceId: number) => {
    console.log("Residence deleted:", residenceId)
    setResidences(prevResidences =>
      prevResidences.filter(residence => residence.id !== residenceId)
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full max-w-2xl mx-auto rounded-lg shadow-md p-6 mb-8 border bg-card">
          <CreateResidenceForm onFormSubmit={handleFormSubmit} />
        </div>
        <div className="w-full bg-white rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableResidence
              residences={residences}
              onResidenceUpdated={handleResidenceUpdated}
              onResidenceDeleted={handleResidenceDeleted}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ResidenceManage