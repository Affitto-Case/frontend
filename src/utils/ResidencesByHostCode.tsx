import { Building2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Residence } from "@/types"
import TableResidence from "@/components/residence/table"

export function ResidenceByHostCode() {

  const { hostCode: urlHostCode } = useParams<{ hostCode: string }>()
  const [residences, setResidences] = useState<Residence[]>([])
  const [hostCode, setHostCode] = useState(urlHostCode || "")
  const [isSearching, setIsSearching] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL

  const loadResidences = useCallback(async (code: string) => {
    if (!code) {
      setResidences([])
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/residences/owner/host_code/${code}`)
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'Host not found' : 'Failed to fetch residences')
      }
      const data = await res.json()
      setResidences(data)
    } catch (error) {
      console.error(error)
      setResidences([])
    } finally {
      setIsSearching(false)
    }
  }, [API_URL])

  // Initial load or update when URL param changes
  useEffect(() => {
    if (urlHostCode) {
      setHostCode(urlHostCode)
      loadResidences(urlHostCode)
    }
  }, [urlHostCode, loadResidences])

  const handleSearch = () => {
    loadResidences(hostCode)
  }




  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4 justify-between">
        <div className="flex gap-3 justify-center items-center">
          <Building2 className="size-6" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">Residences lookup</h1>
            <p className="text-sm text-muted-foreground">Find all properties managed by a specific host</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span className="font-semibold text-foreground whitespace-nowrap">Search by Host Code</span>
          <div className="flex gap-2">
            <Input
              placeholder="Enter host code..."
              value={hostCode}
              onChange={(e) => setHostCode(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 bg-card shadow-sm overflow-hidden">
        <TableResidence residences={residences} />
      </div>
    </div>
  )
}

export default ResidenceByHostCode
