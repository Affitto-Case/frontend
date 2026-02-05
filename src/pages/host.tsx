import { useState, useEffect } from "react"
import { toast } from "sonner"
import TableHost from "@/components/host/tableHost"
import { Shield, Loader2 } from "lucide-react"
import type { Host, User } from "@/types"
import { Input } from "@/components/ui/input"

const API_URL = import.meta.env.VITE_API_URL

export function HostManage() {

  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [searchHost, setSearchHost] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const hostsRes = await fetch(`${API_URL}/api/v1/hosts`)
        if (!hostsRes.ok) throw new Error("Failed to fetch data")
        const hostsData: Host[] = await hostsRes.json()

        setHosts(hostsData)
      } catch (error) {
        console.error(error)
        toast.error("Errore nel caricamento dei dati")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  const filteredHosts = hosts.filter((h) =>
    h.firstName.toLowerCase().includes(searchHost.toLowerCase()) ||
    h.lastName.toLowerCase().includes(searchHost.toLowerCase()) ||
    h.email.toLowerCase().includes(searchHost.toLowerCase()) ||
    h.hostCode.toLowerCase().includes(searchHost.toLowerCase()) ||
    (h.firstName.toLowerCase() + " " + h.lastName.toLowerCase()).includes(searchHost.toLowerCase())
  )

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
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search hosts..."
              value={searchHost}
              onChange={(e) => setSearchHost(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-card rounded-lg border shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TableHost
            hosts={filteredHosts}
            onHostsChange={setHosts}
          />
        )}
      </div>
    </div>
  )
}

export default HostManage