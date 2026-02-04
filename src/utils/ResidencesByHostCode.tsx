import { useLocation } from "react-router-dom"
import { colorClasses, type ColorType, type Residence } from "@/types"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Building2, Search } from "lucide-react"
import InputField from "@/components/common/inputField"
import TableResidence from "@/components/residence/table"

export function ResidenceByHostCode({ color: defaultColor }: { color?: ColorType }) {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]

  const [residences, setResidences] = useState<Residence[]>([])
  const [hostCode, setHostCode] = useState<string>("")

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!hostCode) {
      setResidences([])
      return
    }

    const loadResidences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/residences/owner/host_code/${hostCode}`);
        if (!res.ok) {
          switch (res.status) {
            case 404:
              throw new Error('Risorsa non trovata');
            default:
              throw new Error('Errore nel recupero dei post');
          }
        }
        const residenceRes = await res.json();
        setResidences(residenceRes);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          setResidences([])
        }
      }
    }

    loadResidences()
  }, [hostCode, API_URL])

  function changeValue(value: string) {
    setHostCode(value);
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Building2 className={cn("size-6", theme.icon)} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Residences lookup</h1>
          <p className="text-sm text-muted-foreground">Find all properties managed by a specific host</p>
        </div>
      </div>

      <div className={cn("max-w-md mx-auto p-6 rounded-xl border-2 bg-card shadow-sm", theme.border)}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-lg", theme.bg, theme.icon)}>
            <Search className="size-5" />
          </div>
          <span className="font-semibold text-foreground">Search by Host Code</span>
        </div>
        <InputField label="" desc="Enter host unique code to list their properties" value={hostCode} onChange={changeValue} />
      </div>

      <div className={cn("rounded-xl border-2 bg-white shadow-sm overflow-hidden", theme.border)}>
        <TableResidence residences={residences} />
      </div>
    </div>
  )
}

export default ResidenceByHostCode