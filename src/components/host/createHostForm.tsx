import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Host, PromoteUserDialogProps, User, } from "@/types"



export function PromoteUserDialog({
  open,
  onOpenChange,
  onUserPromoted,
  existingHosts
}: PromoteUserDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/users`)
      const data: User[] = await res.json()

      const hostIds = new Set(existingHosts.map(h => h.id.toString()))
      const nonHosts = data.filter(u => !hostIds.has(u.userId.toString()))

      setUsers(nonHosts)
    } catch (error) {
      toast.error("Errore nel caricamento degli utenti")
    }
  }

  const handlePromote = async () => {
    if (!selectedUserId) return
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/v1/hosts/${selectedUserId}`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Promozione fallita")

      const newHost: Host = await res.json()
      toast.success("Utente promosso a Host!")
      onUserPromoted(newHost)
      setSelectedUserId("")
    } catch (error) {
      toast.error("Errore durante la promozione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promuovi Utente a Host</DialogTitle>
          <DialogDescription>
            Seleziona un utente registrato per abilitarlo come host sulla piattaforma.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="user-select">Seleziona Utente</Label>
            <Select onValueChange={setSelectedUserId} value={selectedUserId}>
              <SelectTrigger id="user-select" className="w-full">
                <SelectValue placeholder="Scegli un utente..." />
              </SelectTrigger>
              <SelectContent
                position="item-aligned"
              >
                <SelectGroup>
                  {users.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Nessun utente disponibile per la promozione
                    </div>
                  ) : (
                    users.map((u) => (
                      <SelectItem key={u.userId} value={u.userId.toString()}>
                        {u.userFirstName} {u.userLastName} ({u.userEmail})
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button
            onClick={handlePromote}
            disabled={!selectedUserId || loading}
          >
            {loading ? "Promozione in corso..." : "Promuovi come Host"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PromoteUserDialog