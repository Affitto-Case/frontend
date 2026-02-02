import { CardStats } from "@/components/common/card";
import type { Booking, Feedback, Host, Residence, User } from "@/types";

export function HeroCard(
    {users,hosts,residences,bookings,feedbacks} : {users: User[],hosts: Host[],residences: Residence[],bookings: Booking[],feedbacks: Feedback[]}
) {
return (
    <>
        <div className="flex flex-col justify-center items-center mt-5 gap-4">
            <p className=" mt-2">Platform Management Dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-3xl mt-5 gap-4">
                <CardStats title={"General stats"} stats={null} color="blue"></CardStats>
                <CardStats title={"Users"} stats={users.length} color="green"></CardStats>
                <CardStats title={"Hosts"} stats={hosts.length} color="yellow"></CardStats>
                <CardStats title={"Residences"} stats={residences.length} color="purple"></CardStats>
                <CardStats title={"Bookings"} stats={bookings.length} color="pink"></CardStats>
                <CardStats title={"Feedbacks"} stats={feedbacks.length} color="red"></CardStats>
            </div>
        </div>
    </>
)
}

export default HeroCard;