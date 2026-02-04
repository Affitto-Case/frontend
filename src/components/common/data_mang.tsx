import ButtonManagment from "./buttonManag"
import { Users, Home, Building2, CalendarCheck, MessageCircle } from "lucide-react";

export function DataManagment() {

    const url = "/crud/";
    return (
        <div className="flex flex-col mt-5 gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                Data Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ButtonManagment title={"Users"} color="blue" path={`${url}user`} icon={Users}></ButtonManagment>
                <ButtonManagment title={"Hosts"} color="green" path={`${url}host`} icon={Home}></ButtonManagment>
                <ButtonManagment title={"Residences"} color="yellow" path={`${url}residence`} icon={Building2}></ButtonManagment>
                <ButtonManagment title={"Bookings"} color="purple" path={`${url}booking`} icon={CalendarCheck}></ButtonManagment>
                <ButtonManagment title={"Feedbacks"} color="pink" path={`${url}feedback`} icon={MessageCircle}></ButtonManagment>
            </div>
        </div>
    )
}

export default DataManagment