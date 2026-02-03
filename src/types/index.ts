import { z } from "zod"

export interface User{
    userId: number,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    address: string,
    registrationDate: string
}

export interface Host{
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


export interface Residence{
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

export interface Booking{
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

export interface Feedback{
    id:	number,
    title:	string,
    rating:	number,
    comment:	string,
    bookingId:	number,
    bookingStartDate:	string,
    bookingEndDate:	string,
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


