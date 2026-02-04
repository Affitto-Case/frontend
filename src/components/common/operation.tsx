import { ButtonOperation } from "./buttonOperation";
import { Search, History, Trophy, Crown, Medal, Users, BedDouble } from "lucide-react";

export function Operation() {

    const url = "/query/";

    return (
        <div className="flex flex-col mt-5 gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                Quick Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ButtonOperation title="Residences by Host Code" color="blue" path={`${url}residencesByHostCode`} icon={Search} />
                <ButtonOperation title="Last User Booking" color="green" path={`${url}lastUserBooking`} icon={History} />
                <ButtonOperation title="Most Popular Residence" color="yellow" path={`${url}mostPopularResidence`} icon={Trophy} />
                <ButtonOperation title="Top Hosts This Month" color="purple" path={`${url}topHostsThisMonth`} icon={Medal} />
                <ButtonOperation title="All Super-Hosts" color="pink" path={`${url}superHosts`} icon={Crown} />
                <ButtonOperation title="Top 5 Users This Month" color="red" path={`${url}topUsersThisMonth`} icon={Users} />
                <ButtonOperation title="Average Beds per Residence" color="blue" path={`${url}averageBeds`} icon={BedDouble} />
            </div>
        </div>
    )
}