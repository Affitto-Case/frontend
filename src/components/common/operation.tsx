import { useState } from "react";
import { ButtonOperation } from "./buttonOperation";
import { Trophy, Crown, Medal, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


export function Operation() {

    const url = "/query/";

    const [hostCode, setHostCode] = useState("");
    const [userName, setUserName] = useState("");

    const navigator = useNavigate();

    return (
        <div className="flex flex-col mt-5 gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                Quick Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center my-auto gap-4">
                    <div className="w-64">
                        <Input
                            placeholder="Residences by host code..."
                            value={hostCode}
                            onChange={(e) => setHostCode(e.target.value)}
                            className="bg-background"
                        />
                    </div>
                    <Button onClick={() => navigator(`${url}residencesByHostCode/${hostCode}`)}>
                        Search
                    </Button>
                </div>
                <div className="flex justify-center items-center my-auto gap-4">
                    <div className="w-64">
                        <Input
                            placeholder="Last user booking..."
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-background"
                        />
                    </div>
                    <Button onClick={() => navigator(`${url}lastUserBooking/${userName}`)}>
                        Search
                    </Button>
                </div>
                <ButtonOperation title="Most Popular Residence" color="yellow" path={`${url}mostPopularResidence`} icon={Trophy} />
                <ButtonOperation title="Top Hosts This Month" color="purple" path={`${url}topHostsThisMonth`} icon={Medal} />
                <ButtonOperation title="All Super-Hosts" color="pink" path={`${url}superHosts`} icon={Crown} />
                <ButtonOperation title="Top 5 Users This Month" color="red" path={`${url}topUsersThisMonth`} icon={Users} />
            </div>
        </div>
    )
}