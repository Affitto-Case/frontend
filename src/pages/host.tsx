import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import TableHost from "@/components/host/tableHost"
import PromoteUserDialog from "@/components/host/createHostForm"
import type { Host } from "@/types"


const API_URL = import.meta.env.VITE_API_URL

export function HostManage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false)

  useEffect(() => {
    fetchHosts()
  }, [])

  const fetchHosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/hosts`)
      if (!res.ok) throw new Error("Failed to fetch hosts")
      
      const data: Host[] = await res.json()
      setHosts(data)
    } catch (error) {
      console.error(error)
      toast.error("Errore nel caricamento degli host")
    } finally {
      setLoading(false)
    }
  }

  const handleUserPromoted = (newHost: Host) => {
    setHosts(prevHosts => [...prevHosts, newHost])
    setPromoteDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Caricamento gestione host...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-6">
        {/* Header con Titolo e Bottone di Azione */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Host Management</h1>
            <p className="text-muted-foreground">Gestisci i permessi e visualizza le statistiche degli host.</p>
          </div>
          <Button onClick={() => setPromoteDialogOpen(true)}>
            Promote User to Host
          </Button>
        </div>

        <div className="rounded-md border bg-card">
          <TableHost 
            hosts={hosts} 
            onHostsChange={setHosts} 
          />
        </div>

        <PromoteUserDialog 
          open={promoteDialogOpen}
          onOpenChange={setPromoteDialogOpen}
          onUserPromoted={handleUserPromoted}
          existingHosts={hosts} 
        />
      </div>
    </div>
  )
}

export default HostManage