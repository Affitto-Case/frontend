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



export function TableHost({ hosts, onHostsChange }: { hosts: Host[], onHostsChange: (hosts: Host[]) => void }) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

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


  return (
    <>
      <div className="w-full">
        <TableCrud
          hosts={hosts}
          handleViewClick={handleViewClick}
          handleDeleteClick={handleDeleteClick}
        />
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