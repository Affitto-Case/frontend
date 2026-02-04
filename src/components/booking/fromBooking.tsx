import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { toast } from "sonner"
import {
  CalendarDays,
  Info,
  Home,
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Booking, User, Residence } from "@/types"

const bookingFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  residenceId: z.string().min(1, "Please select a residence"),
  userId: z.string().min(1, "Please select a guest")
})

type BookingFormValues = z.infer<typeof bookingFormSchema>
const API_URL = import.meta.env.VITE_API_URL

const CreateBookingForm = ({ onFormSubmit }: { onFormSubmit?: (data: Booking) => void }) => {
  const [users, setUsers] = useState<User[]>([])
  const [residences, setResidences] = useState<Residence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingBookings, setIsFetchingBookings] = useState(false)

  const [selectedRes, setSelectedRes] = useState<Residence | null>(null)
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([])
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users`),
          fetch(`${API_URL}/api/v1/residences`)
        ])
        setUsers(await uRes.json())
        setResidences(await rRes.json())
      } catch {
        toast.error("Error loading initial data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { startDate: "", endDate: "", residenceId: "", userId: "" }
  })

  const handleResidenceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedRes(null)
    setCurrentBookings([])

    if (!id) return

    const resBase = residences.find(r => r.id === Number(id))
    if (resBase) setSelectedRes(resBase)

    setIsFetchingBookings(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/bookings/residence/${id}`)
      if (res.ok) {
        setCurrentBookings(await res.json())
      }
    } catch (error) {
      console.error("Fetch bookings error:", error)
    } finally {
      setIsFetchingBookings(false)
    }
  }

  const onSubmit = async (formData: BookingFormValues) => {
    try {
      const finalPayload = {
        startDate: `${formData.startDate}T15:00:00`,
        endDate: `${formData.endDate}T10:00:00`,
        residenceId: Number(formData.residenceId),
        userId: Number(formData.userId)
      }
      const res = await fetch(`${API_URL}/api/v1/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload)
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      toast.success("Booking confirmed")
      reset()
      setSelectedRes(null)
      setCurrentBookings([])
      if (onFormSubmit) onFormSubmit(saved)
    } catch {
      toast.error("Failed to save booking")
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* FORM PANEL */}
        <form className="w-full md:w-96 space-y-6 p-6 bg-white rounded-lg border border-border shadow-sm" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Create Booking</h2>
            <p className="text-sm text-muted-foreground">Enter details for the new reservation.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Guest</Label>
              <select {...register("userId")} id="userId" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Select a guest</option>
                {users.map(u => <option key={u.userId} value={u.userId}>{u.userFirstName} {u.userLastName}</option>)}
              </select>
              {errors.userId && <p className="text-destructive text-[12px]">{errors.userId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="residenceId">Residence</Label>
              <select
                {...register("residenceId")}
                id="residenceId"
                onChange={(e) => {
                  register("residenceId").onChange(e)
                  handleResidenceChange(e)
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select a residence</option>
                {residences.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {errors.residenceId && <p className="text-destructive text-[12px]">{errors.residenceId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Check-in</Label>
                <Input {...register("startDate")} type="date" id="startDate" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Check-out</Label>
                <Input {...register("endDate")} type="date" id="endDate" className="h-9" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Reservation
          </Button>
        </form>

        {/* INFO PANEL */}
        <div className="flex-1 w-full min-h-112.5 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
          {isFetchingBookings ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading availability...</p>
            </div>
          ) : selectedRes ? (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{selectedRes.name}</h3>
              </div>

              <div className="space-y-6">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <CalendarDays className="h-4 w-4" />
                    Season Dates
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available from {new Date(selectedRes.availableFrom).toLocaleDateString()} to {new Date(selectedRes.availableTo).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium leading-none">Existing Bookings</h4>
                  <Separator />

                  {currentBookings.length > 0 ? (
                    <div className="grid gap-2 max-h-62.5 overflow-y-auto pr-2">
                      {currentBookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => setViewingBooking(b)}
                          className="flex items-center justify-between p-3 rounded-md border border-border bg-background hover:bg-accent transition-colors cursor-pointer group"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{b.userFirstName} {b.userLastName}</p>
                            <p className="text-xs text-muted-foreground">Booking #{b.id}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground">
                              {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                            </span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                      <AlertCircle className="h-4 w-4" />
                      No bookings found for this residence.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <Info className="h-10 w-10 text-muted-foreground/20 mb-4" />
              <p className="text-sm text-muted-foreground">Select a residence to view availability and existing bookings.</p>
            </div>
          )}
        </div>
      </div>

      {/* STANDARD SHADCN DIALOG */}
      <Dialog open={!!viewingBooking} onOpenChange={() => setViewingBooking(null)}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Summary of the selected reservation.
            </DialogDescription>
          </DialogHeader>

          {viewingBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase">Guest</Label>
                <div className="col-span-3 text-sm font-medium">
                  {viewingBooking.userFirstName} {viewingBooking.userLastName}
                  <p className="text-xs text-muted-foreground font-normal">{viewingBooking.userEmail}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase">Period</Label>
                <div className="col-span-3 text-sm">
                  {new Date(viewingBooking.startDate).toLocaleDateString()} — {new Date(viewingBooking.endDate).toLocaleDateString()}
                  <p className="text-xs text-muted-foreground">{viewingBooking.numberOfNights} nights total</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase">Total</Label>
                <div className="col-span-3 text-sm font-semibold text-primary">
                  ${viewingBooking.totalPrice.toFixed(2)}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-muted-foreground text-xs uppercase">Host</Label>
                <div className="col-span-3 text-sm italic text-muted-foreground">
                  {viewingBooking.hostName} ({viewingBooking.hostCode})
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingBooking(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBookingForm