import { useState } from "react"
import type { Residence } from "@/types/index"
import TableResidence from "@/components/residence/table"
import CreateResidenceForm from "@/components/residence/formResidence"

export function ResidenceManage({ residences: initialResidences }: { residences: Residence[] }) {
  // Stato tipizzato correttamente come array di Residence
  const [residences, setResidences] = useState<Residence[]>(initialResidences)

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
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="rounded-lg shadow-md p-6 mb-8">
          <CreateResidenceForm onFormSubmit={handleFormSubmit} />
        </div>
        <TableResidence
          residences={residences}
          onResidenceUpdated={handleResidenceUpdated}
          onResidenceDeleted={handleResidenceDeleted}
        />
      </div>
    </div>
  )
}

export default ResidenceManage