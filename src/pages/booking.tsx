import { useEffect, useState } from "react"
import type { Booking } from "@/types/index"
import TableBooking from "@/components/booking/table"
import CreateBookingForm from "@/components/booking/fromBooking"
import { toast } from "sonner"
import { Loader2, CalendarDays, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function BookingManage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchBooking, setSearchBooking] = useState("")
  const [open, setOpen] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    setIsLoading(true);
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/bookings`)
        if (!res.ok) {
          throw new Error("Failed to fetch users")
        }
        const bookingsResp = await res.json();
        setBookings(bookingsResp)
        toast.success("Data loaded successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [])

  const handleBookingDeleted = (bookingId: number) => {
    console.log("Booking deleted:", bookingId)
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId))
  }

  const handleBookingUpdated = (updatedBooking: Booking) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    )
  }

  const handleFormSubmit = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking])
    setOpen(false)
  }

  const filteredBookings = bookings.filter((b) =>
    b.residenceName.toLowerCase().includes(searchBooking.toLowerCase()) ||
    b.userFirstName.toLowerCase().includes(searchBooking.toLowerCase()) ||
    b.userLastName.toLowerCase().includes(searchBooking.toLowerCase()) ||
    (b.userFirstName + " " + b.userLastName).toLowerCase().includes(searchBooking.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4 justify-between">
        <div className="flex items-center justify-center gap-4">
          <CalendarDays className="size-6" />
          <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Search bookings..."
              value={searchBooking}
              onChange={(e) => setSearchBooking(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="size-4 mr-2" />
            Add Booking
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full bg-card rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableBooking
              bookings={filteredBookings}
              onBookingUpdated={handleBookingUpdated}
              onBookingDeleted={handleBookingDeleted}
            />
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Booking</DialogTitle>
            <DialogDescription>
              Record a new booking in the system.
            </DialogDescription>
          </DialogHeader>
          <CreateBookingForm onFormSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingManage