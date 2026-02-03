import DataManagment from "@/components/common/data_mang";
import HeroCard from "@/components/common/hero";
import { Operation } from "@/components/common/operation";
import type { Booking, Feedback, Host, Residence, User } from "@/types";




export function Homepage(
    {users,hosts,residences,bookings,feedbacks} : {users: User[],hosts: Host[],residences: Residence[],bookings: Booking[],feedbacks: Feedback[]}
) {
return (
    <>
    <h1 className="text-xl font-bold mb-4">Welcome, Operator </h1>
    <div className="container mx-auto px-6 py-8">
        <div className=" rounded-lg shadow-md p-6 mb-8">
        <HeroCard 
        users={users}
        hosts={hosts}
        residences={residences}
        bookings={bookings}
        feedbacks={feedbacks}>
        </HeroCard>
    </div>
        <div className=" rounded-lg shadow-md p-6 mb-8">
            <Operation />
        </div>
        <div className=" rounded-lg shadow-md p-6 mb-8">
            <DataManagment />
        </div>
        </div>
    </>
)
}

export default Homepage;