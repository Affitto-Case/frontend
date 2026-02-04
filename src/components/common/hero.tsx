import { CardStats } from "@/components/common/card";
import type { Booking, Feedback, Host, Residence, User } from "@/types";
import { Users, Home, Building2, CalendarDays, MessageSquare, BarChart3 } from "lucide-react";

export function HeroCard(
    { users, hosts, residences, bookings, feedbacks }: { users: User[], hosts: Host[], residences: Residence[], bookings: Booking[], feedbacks: Feedback[] }
) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardStats title={"Total Users"} stats={users.length} color="blue" icon={Users}></CardStats>
                <CardStats title={"Active Hosts"} stats={hosts.length} color="green" icon={Home}></CardStats>
                <CardStats title={"Residences"} stats={residences.length} color="purple" icon={Building2}></CardStats>
                <CardStats title={"Bookings"} stats={bookings.length} color="pink" icon={CalendarDays}></CardStats>
                <CardStats title={"Feedbacks"} stats={feedbacks.length} color="red" icon={MessageSquare}></CardStats>
                <CardStats title={"Platform Health"} stats={null} color="yellow" icon={BarChart3}></CardStats>
            </div>
        </div>
    )
}

export default HeroCard;