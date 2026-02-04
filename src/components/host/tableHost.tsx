import { useState } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon, Star, UserIcon, Mail, MapPin, Calendar, Hash, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import type { Host, TableHostProps } from "@/types"



export function TableHost({ hosts, onHostsChange }: TableHostProps) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedHost, setSelectedHost] = useState<Host | null>(null)
  
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Host Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hosts.map((h) => (
            <TableRow key={h.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{h.hostCode}</TableCell>
              <TableCell className="font-medium">
                {h.firstName} {h.lastName}
              </TableCell>
              <TableCell>{h.email}</TableCell>
              <TableCell>{h.totalBookings}</TableCell>
              <TableCell>
                {h.isSuperHost ? (
                  <div className="flex items-center text-yellow-600 gap-1">
                    <Star className="size-4 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Superhost</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-tighter">Standard Host</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewClick(h)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(h)}
                    >
                      Remove Host
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
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