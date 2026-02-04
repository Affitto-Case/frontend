import { useEffect, useState } from "react"
import type { Booking } from "@/types/index"
import TableBooking from "@/components/booking/table"
import CreateBookingForm from "@/components/booking/fromBooking"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function BookingManage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const handleFormSubmit = (data: Booking) => {
    console.log("Booking created:", data)
    const newBooking: Booking = {
      ...data,
    }

    setBookings(prevBookings => [...prevBookings, newBooking])
  }

  const handleBookingUpdated = (updatedBooking: Booking) => {
    console.log("Booking updated:", updatedBooking)

    // Aggiorna la prenotazione nella lista tramite bookingId
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === updatedBooking.id
          ? { ...updatedBooking }
          : booking
      )
    )
  }

  const handleBookingDeleted = (bookingId: number) => {
    console.log("Booking deleted:", bookingId)
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId))
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full rounded-lg shadow-md p-6 mb-8 border bg-card">
          <CreateBookingForm onFormSubmit={handleFormSubmit} />
        </div>
        <div className="w-full bg-white rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableBooking
              bookings={bookings}
              onBookingUpdated={handleBookingUpdated}
              onBookingDeleted={handleBookingDeleted}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingManage