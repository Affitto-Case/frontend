import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Loader2, Crown, CalendarCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { TopUserStats } from "@/types";


export function TopUsersMonthly() {
  const [users, setUsers] = useState<TopUserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/stats/mdb`);
        if (!res.ok) throw new Error("Failed to fetch top users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Error loading rankings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Guest Loyalty</h2>
      </div>

      <Card className="border-2 border-primary/10 shadow-md">
        <CardHeader className="bg-primary/5 pb-6">
          <CardTitle className="text-2xl">Top 5 Guests</CardTitle>
          <CardDescription>
            Users with the highest number of stay days last month
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Calculating stay durations...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.userId}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center font-black text-muted-foreground/30 text-2xl">
                      {index + 1}
                    </div>

                    <Avatar className="h-12 w-12 border shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold leading-none">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-primary/5 px-5 py-2 rounded-xl border border-primary/10">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                        Total Days
                      </p>
                      <p className="text-xl font-black text-primary leading-none">
                        {user.totalDays}
                      </p>
                    </div>
                  </div>
                </div>
                {index < users.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <User className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">No activity data found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TopUsersMonthly;