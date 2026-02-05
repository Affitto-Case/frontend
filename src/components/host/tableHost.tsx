import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star, UserIcon, Mail, MapPin, Calendar, Hash, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import type { Host, User } from "@/types"
import { TableCrud } from "../common/table"
import { Input } from "@/components/ui/input"



export function TableHost({ hosts, onHostsChange, onUserPromoted }: { hosts: Host[], onHostsChange: (hosts: Host[]) => void, onUserPromoted: (host: Host) => void }) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [noHost, setNoHost] = useState<User[]>([])
  const [searchUser, setSearchUser] = useState("")
  const [searchHost, setSearchHost] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users`)
        const data: User[] = await res.json()
        const hostIds = new Set(hosts.map(h => h.id.toString()))
        setNoHost(data.filter(u => !hostIds.has(u.userId.toString())))
      } catch (error) {
        toast.error("Errore nel caricamento degli utenti")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

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


  // Open the view dialog
  const handleViewClick = (host: Host) => {
    setSelectedHost(host)
    setViewDialogOpen(true)
  }

  // Open the delete confirmation dialog
  const handleDeleteClick = (host: Host) => {
    setSelectedHost(host)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSubmit = async () => {
    if (!selectedHost) return

    try {
      const res = await fetch(`${API_URL}/api/v1/hosts/${selectedHost.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error during deletion")

      toast.success("Host role removed successfully")
      // Filter the list using the ID from your DTO
      onHostsChange(hosts.filter((h) => h.id !== selectedHost.id))
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Failed to delete host")
    }
  }


  const filteredUsers = noHost.filter((u) =>
    u.userFirstName.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.userLastName.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.userEmail.toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.userFirstName.toLowerCase() + " " + u.userLastName.toLowerCase()).includes(searchUser.toLowerCase())
  )

  const filteredHosts = hosts.filter((h) =>
    h.firstName.toLowerCase().includes(searchHost.toLowerCase()) ||
    h.lastName.toLowerCase().includes(searchHost.toLowerCase()) ||
    h.email.toLowerCase().includes(searchHost.toLowerCase()) ||
    h.hostCode.toLowerCase().includes(searchHost.toLowerCase()) ||
    (h.firstName.toLowerCase() + " " + h.lastName.toLowerCase()).includes(searchHost.toLowerCase())
  )

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Star className="size-5 text-yellow-600" />
              Current Hosts
            </h2>
            <div className="w-48">
              <Input
                placeholder="Search hosts..."
                value={searchHost}
                onChange={(e) => setSearchHost(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <div className="rounded-md border bg-card">
            <TableCrud hosts={filteredHosts} handleViewClick={handleViewClick} handleDeleteClick={handleDeleteClick} />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <UserIcon className="size-5 text-primary" />
              Promotion List
            </h2>
            <div className="w-48">
              <Input
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
          <div className="rounded-md border bg-card">
            <TableCrud users={filteredUsers} handlePromoteClick={handlePromote} className="w-full overflow-x-auto" />
          </div>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Host Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected host profile.
            </DialogDescription>
          </DialogHeader>

          {selectedHost && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border">
                <div className="p-2 bg-background rounded-full shadow-sm">
                  <UserIcon className="size-8 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{selectedHost.firstName} {selectedHost.lastName}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Mail className="size-3" /> {selectedHost.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 bg-background p-2 rounded border">
                  <Hash className="size-4 text-muted-foreground" />
                  <span><strong>Code:</strong> {selectedHost.hostCode}</span>
                </div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border">
                  <Star className={`size-4 ${selectedHost.isSuperHost ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                  <span><strong>SuperHost:</strong> {selectedHost.isSuperHost ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 bg-background p-2 rounded border">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span><strong>Address:</strong> {selectedHost.address}</span>
                </div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span><strong>Joined:</strong> {selectedHost.registrationDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border">
                  <BarChart3 className="size-4 text-muted-foreground" />
                  <span><strong>Total Bookings:</strong> {selectedHost.totalBookings}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Host Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this user's host privileges?
              They will be demoted to a standard user. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedHost && (
            <div className="py-4 px-4 bg-destructive/5 border border-destructive/10 rounded-md my-2">
              <p className="text-sm">
                Removing host: <span className="font-bold text-destructive">{selectedHost.firstName} {selectedHost.lastName}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 uppercase">
                Host ID: {selectedHost.hostCode}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Confirm Removal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHost