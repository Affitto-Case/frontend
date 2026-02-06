import DataManagment from "@/components/common/data_mang";
import HeroCard from "@/components/common/hero";
import { Operation } from "@/components/common/operation";

export function Homepage(
    { 
  users,
  hosts,
  residences,
  bookings,
  feedbacks
}: {
  users: number
  hosts: number
  residences: number
  bookings: number
  feedbacks: number
}

) {
    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Welcome back, Operator. Here's what's happening on the platform today.
                </p>
            </div>

            {/* Hero / Stats Section */}
            <section>
                <HeroCard
                    users={users}
                    hosts={hosts}
                    residences={residences}
                    bookings={bookings}
                    feedbacks={feedbacks}
                />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Operations Section */}
                <section className="bg-muted/50 p-6 rounded-xl border">
                    <Operation />
                </section>

                {/* Data Management Section */}
                <section className="bg-muted/50 p-6 rounded-xl border">
                    <DataManagment />
                </section>
            </div>
        </div>
    )
}

export default Homepage;

