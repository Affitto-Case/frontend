export interface User{
    userId: number,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    address: string,
    registrationDate: string
}

export interface Host{
    userId: number,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
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





