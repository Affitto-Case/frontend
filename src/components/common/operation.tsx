import { ButtonOperation } from "./buttonOperation";



export function Operation(){

    const url="/query/";

    return(
        <>
         <div className="flex flex-col justify-center items-center mt-5">
            <h1 className="text-xl font-bold  mb-4 flex items-center">QUICK OPERATIONS</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <ButtonOperation title="Residences by Host Code" color="blue" path={`${url}residencesByHostCode`} />
            <ButtonOperation title="Last User Booking" color="green" path={`${url}lastUserBooking`} />
            <ButtonOperation title="Most Popular Residence" color="yellow" path={`${url}mostPopularResidence`} />
            <ButtonOperation title="Top Hosts This Month" color="purple" path={`${url}topHostsThisMonth`} />
            <ButtonOperation title="All Super-Hosts" color="pink" path={`${url}superHosts`} />
            <ButtonOperation title="Top 5 Users This Month" color="red" path={`${url}topUsersThisMonth`} />
            <ButtonOperation title="Average Beds per Residence" color="blue" path={`${url}averageBeds`} />

        </div>
               
        </div>

        </>
    )
}