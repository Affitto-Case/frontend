import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"
import TableHost from "@/components/host/tableHost"
import PromoteUserDialog from "@/components/host/createHostForm"
import { Shield } from "lucide-react"
import type { Host, ColorType } from "@/types"
import { colorClasses } from "@/types"
import { cn } from "@/lib/utils"

const API_URL = import.meta.env.VITE_API_URL

export function HostManage({ color: defaultColor }: { color?: ColorType }) {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]

  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false)

  useEffect(() => {
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
    fetchHosts()
  }, [])

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
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Shield className={cn("size-6", theme.icon)} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Management</h1>
          <p className="text-muted-foreground">Gestisci i permessi e visualizza le statistiche degli host.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        <div className={cn("rounded-md border-2 bg-card shadow-sm", theme.border)}>
          <TableHost
            hosts={hosts}
            onHostsChange={setHosts}
            onUserPromoted={handleUserPromoted}
          />
        </div>

        <PromoteUserDialog
          open={promoteDialogOpen}
          onOpenChange={setPromoteDialogOpen}
          onUserPromoted={handleUserPromoted}
          existingHosts={hosts}
          color={themeColor}
        />
      </div>
    </div>
  )
}

export default HostManage