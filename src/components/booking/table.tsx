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
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { MoreHorizontalIcon, UserIcon, HomeIcon, CalendarDaysIcon, InfoIcon } from "lucide-react"
import { toast } from "sonner"
import type { Booking } from "@/types"

interface TableBookingProps {
  bookings: Booking[];
  onBookingUpdated?: (updated: Booking) => void;
  onBookingDeleted?: (id: number) => void;
}

export function TableBooking({ 
  bookings, 
  onBookingDeleted 
}: TableBookingProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const API_URL = import.meta.env.VITE_API_URL


  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setDetailDialogOpen(true)
  }

  
  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSubmit = async () => {
    if (!selectedBooking || !selectedBooking.id) return

    try {
      const res = await fetch(`${API_URL}/api/v1/bookings/${selectedBooking.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete booking")

      toast.success("Booking deleted successfully")
      if (onBookingDeleted) onBookingDeleted(selectedBooking.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting booking")
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Residence</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Check-in / Out</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-1">
                    <HomeIcon className="size-3" /> {b.residenceName}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.residenceAddress}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="flex items-center gap-1">
                    <UserIcon className="size-3" /> {b.userFirstName} {b.userLastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.userEmail}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs">
                <div>In: {formatDate(b.startDate)}</div>
                <div>Out: {formatDate(b.endDate)}</div>
              </TableCell>
              <TableCell>{b.numberOfNights}</TableCell>
              <TableCell className="font-bold text-green-600">
                ${b.totalPrice?.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(b)}>
                      <InfoIcon className="mr-2 size-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive font-semibold"
                      onClick={() => handleDeleteClick(b)}
                    >
                      Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDaysIcon className="size-5 text-primary" /> Booking Summary
            </DialogTitle>
            <DialogDescription>
              Full details for reservation #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase pt-1">Residence</Label>
                <div className="col-span-3 font-medium">
                  {selectedBooking.residenceName}
                  <p className="text-xs text-muted-foreground font-normal">{selectedBooking.residenceAddress}</p>
                </div>
              </div>
              
              <Separator />

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase pt-1">Guest</Label>
                <div className="col-span-3 font-medium">
                  {selectedBooking.userFirstName} {selectedBooking.userLastName}
                  <p className="text-xs text-muted-foreground font-normal">{selectedBooking.userEmail}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase pt-1">Stay</Label>
                <div className="col-span-3">
                  <div className="flex justify-between mb-1">
                    <span>Check-in:</span>
                    <span className="font-medium">{formatDate(selectedBooking.startDate)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Check-out:</span>
                    <span className="font-medium">{formatDate(selectedBooking.endDate)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-dashed mt-1">
                    <span>Nights:</span>
                    <span className="font-medium">{selectedBooking.numberOfNights}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase">Host</Label>
                <div className="col-span-3 italic text-muted-foreground">
                  {selectedBooking.hostName} ({selectedBooking.hostCode})
                </div>
              </div>

              <div className="mt-2 p-3 bg-muted rounded-md flex justify-between items-center">
                <span className="font-semibold">Total Price</span>
                <span className="text-lg font-bold text-primary">${selectedBooking.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This will permanently remove the reservation for 
              <strong> {selectedBooking?.userFirstName} {selectedBooking?.userLastName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableBooking