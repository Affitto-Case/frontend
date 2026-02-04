import { z } from "zod"

export interface User {
  userId: number,
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  address: string,
  registrationDate: string
}

export interface Host {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  address: string,
  registrationDate: string,
  hostCode: string,
  totalBookings: number,
  isSuperHost: boolean
}


export interface Residence {
  id: number,
  name: string,
  address: string,
  price: number,
  numberOfRooms: number,
  guestCapacity: number,
  floor: number,
  availableFrom: string,
  availableTo: string,
  hostId: number,
  hostName: string,
  hostEmail: string,
  hostCode: string
}

export interface Booking {
  id: number,
  startDate: string,
  endDate: string,
  residenceId: number,
  residenceName: string,
  residenceAddress: string,
  pricePerNight: number,
  userId: number,
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  hostId: number,
  hostName: string,
  hostEmail: string,
  hostCode: string
  numberOfNights: number,
  totalPrice: number
}

export interface Feedback {
  id: number,
  title: string,
  rating: number,
  comment: string,
  bookingId: number,
  bookingStartDate: string,
  bookingEndDate: string,
  residenceId: number,
  residenceName: string,
  residenceAddress: string,
  userId: number,
  userFirstName: string,
  userLastName: string,
  userEmail: string,
}

export type ColorType = 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'red';



export const userSchema = z.object({
  firstName: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  lastName: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  address: z.string().min(5, "L'indirizzo è troppo breve"),
})

export type UserFormValues = z.infer<typeof userSchema>

export interface TableBookingProps {
  bookings: Booking[];
  onBookingUpdated?: (updated: Booking) => void;
  onBookingDeleted?: (id: number) => void;
}

export interface PromoteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserPromoted: (newHost: Host) => void
  existingHosts: Host[]
  color: ColorType
}

export interface TableHostProps {
  hosts: Host[]
  onHostsChange: (hosts: Host[]) => void
}

export interface TableResidenceProps {
  residences: Residence[];
  onResidenceUpdated?: (updated: Residence) => void;
  onResidenceDeleted?: (id: number) => void;
}

export interface TableUserProps {
  users: User[]
  onUserUpdated?: (user: User) => void
  onUserDeleted?: (userId: number) => void
}

export interface TopUserStats {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  totalDays: number;
}

export interface AvgBedsResponse {
  avgnumberOfBeds: number;
}



export const colorClasses: Record<ColorType, {
  button: string,
  icon: string,
  border: string,
  bg: string,
  text: string
}> = {
  blue: {
    button: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    icon: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-900"
  },
  green: {
    button: "bg-green-500 hover:bg-green-600 text-white border-green-600",
    icon: "text-green-600",
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-900"
  },
  yellow: {
    button: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600",
    icon: "text-yellow-600",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    text: "text-yellow-900"
  },
  purple: {
    button: "bg-purple-500 hover:bg-purple-600 text-white border-purple-600",
    icon: "text-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
    text: "text-purple-900"
  },
  pink: {
    button: "bg-pink-500 hover:bg-pink-600 text-white border-pink-600",
    icon: "text-pink-600",
    border: "border-pink-200",
    bg: "bg-pink-50",
    text: "text-pink-900"
  },
  red: {
    button: "bg-red-500 hover:bg-red-600 text-white border-red-600",
    icon: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-900"
  }
}