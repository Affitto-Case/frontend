import { CardStats } from "@/components/common/card";
import type { AvgBedsResponse, Booking, Feedback, Host, Residence, User } from "@/types";
import { Users, Home, Building2, CalendarDays, MessageSquare, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function HeroCard(
    { users, hosts, residences, bookings, feedbacks }: { users: User[], hosts: Host[], residences: Residence[], bookings: Booking[], feedbacks: Feedback[] }
) {

    const [avgBeds, setAvgBeds] = useState<AvgBedsResponse | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    

    useEffect(() => {
        const fetchAvgBeds = async () => {
          try {
            const res = await fetch(`${API_URL}/api/v1/residences/stats/avg`);
            if (!res.ok) throw new Error("Failed to fetch average beds");
            const result = await res.json();
            setAvgBeds(result);
          } catch (error) {
            toast.error("Error loading average beds statistic");
          }
        };
    
        fetchAvgBeds();
      }, []);
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <CardStats title={"Total Users"} stats={users.length} color="blue" icon={Users}></CardStats>
                <CardStats title={"Active Hosts"} stats={hosts.length} color="green" icon={Home}></CardStats>
                <CardStats title={"Residences"} stats={residences.length} color="purple" icon={Building2}></CardStats>
                <CardStats title={"Bookings"} stats={bookings.length} color="pink" icon={CalendarDays}></CardStats>
                <CardStats title={"Feedbacks"} stats={feedbacks.length} color="red" icon={MessageSquare}></CardStats>
                <CardStats title={"Average Beds"} stats={avgBeds?.avgnumberOfBeds || 0} color="yellow" icon={BarChart3}></CardStats>
            </div>
        </div>
    )
}

export default HeroCard;