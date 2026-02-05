import { useState, useEffect } from "react"
import { toast } from "sonner"
import TableHost from "@/components/host/tableHost"
import { Shield } from "lucide-react"
import type { Host } from "@/types"

const API_URL = import.meta.env.VITE_API_URL

export function HostManage() {

  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)

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
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Caricamento gestione host...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4 justify-between">
        <div className="flex items-center justify-center gap-4">
          <Shield className="size-6" />
          <h1 className="text-2xl font-bold tracking-tight">Host Management</h1>
        </div>
        <p className="text-sm text-muted-foreground hidden md:block">
          Manage permissions and view host statistics.
        </p>
      </div>

      <div className="w-full bg-card rounded-lg border shadow-sm">
        <TableHost
          hosts={hosts}
          onHostsChange={setHosts}
          onUserPromoted={handleUserPromoted}
        />
      </div>
    </div>
  )
}

export default HostManage