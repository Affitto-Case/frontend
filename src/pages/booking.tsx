import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import type { Booking, ColorType } from "@/types/index"
import { colorClasses } from "@/types/index"
import { cn } from "@/lib/utils"
import TableBooking from "@/components/booking/table"
import CreateBookingForm from "@/components/booking/fromBooking"
import { toast } from "sonner"
import { Loader2, CalendarDays } from "lucide-react"

export function BookingManage({ color: defaultColor }: { color?: ColorType }) {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]
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
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <CalendarDays className={cn("size-6", theme.icon)} />
        <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className={cn("w-full rounded-lg shadow-md p-6 mb-8 border-2 bg-card", theme.border)}>
          <CreateBookingForm onFormSubmit={handleFormSubmit} color={themeColor} />
        </div>
        <div className={cn("w-full bg-white rounded-lg border-2 shadow-sm", theme.border)}>
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