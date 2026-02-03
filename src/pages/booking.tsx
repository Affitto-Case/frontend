import { useState } from "react"
import type { Booking } from "@/types/index"
import TableBooking from "@/components/booking/table"
import CreateBookingForm from "@/components/booking/fromBooking"

export function BookingManage({ bookings: initialBookings }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

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
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="rounded-lg shadow-md p-6 mb-8">
          <CreateBookingForm onFormSubmit={handleFormSubmit} />
        </div>
        <TableBooking
          bookings={bookings}
          onBookingUpdated={handleBookingUpdated}
          onBookingDeleted={handleBookingDeleted}
        />
      </div>
    </div>
  )
}

export default BookingManage