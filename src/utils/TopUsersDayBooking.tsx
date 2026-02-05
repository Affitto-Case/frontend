import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Loader2, Crown, CalendarCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { type TopUserStats } from "@/types";


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
  }, [API_URL]);

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Crown className="size-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guest Loyalty</h1>
          <p className="text-sm text-muted-foreground">Recognizing our most frequent travelers</p>
        </div>
      </div>

      <Card className="border-2 shadow-xl overflow-hidden">
        <CardHeader className="pb-8 bg-muted/20">
          <div className="flex items-start justify-between mt-4">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Top Guests of the Month</CardTitle>
              <CardDescription className="text-muted-foreground/80 font-medium">
                Calculated based on the highest cumulative stay duration
              </CardDescription>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-white shadow-sm">
              <Crown className="size-6 text-primary" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-muted/5">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Calculating stay durations...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.userId} className="group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 transition-all hover:bg-muted/30">
                  <div className="flex items-center gap-6">
                    <div className="flex h-10 w-10 items-center justify-center font-black text-muted-foreground/20 text-4xl italic">
                      {index + 1}
                    </div>

                    <Avatar className="h-16 w-16 border-2 shadow-md transition-transform group-hover:scale-105">
                      <AvatarFallback className="bg-white font-black text-xl uppercase text-primary">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end px-8 py-3 rounded-2xl border bg-card shadow-sm min-w-[140px]">
                    <div className="p-3 rounded-xl bg-muted">
                      <CalendarCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-[0.2em] mb-1 text-right">
                        Total Stay
                      </p>
                      <div className="flex items-baseline gap-1 justify-end">
                        <p className="text-3xl font-black leading-none text-primary">
                          {user.totalDays}
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Days</span>
                      </div>
                    </div>
                  </div>
                </div>
                {index < users.length - 1 && <Separator className="opacity-50" />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10">
              <User className="h-12 w-12 mb-3 opacity-10" />
              <p className="text-sm font-bold">No activity recorded for this ranking period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TopUsersMonthly;