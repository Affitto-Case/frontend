import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, User, Mail, Trophy, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Host } from "@/types";

export function TopHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTopHosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/stats/hosts`);
        if (!res.ok) throw new Error("Failed to fetch host rankings");
        const data = await res.json();
        setHosts(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error loading rankings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopHosts();
  }, [API_URL]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Performance Ranking</h2>
      </div>

      <Card className="border-2 border-primary/10 shadow-md">
        <CardHeader className="bg-primary/5 pb-6">
          <CardTitle className="text-2xl">Top Hosts of the Month</CardTitle>
          <CardDescription>
            Recognizing hosts with the highest booking volume
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Calculating rankings...</p>
            </div>
          ) : hosts.length > 0 ? (
            hosts.map((host, index) => (
              <div key={host.id || index}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase">
                          {host.firstName[0]}{host.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 shadow-sm">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold leading-none">
                          {host.firstName} {host.lastName}
                        </h3>
                        {host.isSuperHost && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                            Superhost
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{host.email}</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground opacity-70">
                        Code: {host.hostCode}
                      </p>
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-black text-primary leading-none">
                      {host.totalBookings}
                    </p>
                  </div>
                </div>
                {index < hosts.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <User className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">No host data available for this period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TopHosts;