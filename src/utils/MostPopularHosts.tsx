import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, User, Mail, Trophy, Loader2, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { type Host } from "@/types";

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
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Trophy className="size-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Top Performance</h1>
          <p className="text-sm text-muted-foreground">Recognizing our most active and successful hosts</p>
        </div>
      </div>

      <Card className="border-2 shadow-xl overflow-hidden">
        <CardHeader className="pb-8 bg-muted/20">
          <div className="flex items-start justify-between mt-4">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Host Leaderboard</CardTitle>
              <CardDescription className="text-muted-foreground/80 font-medium">
                Ranking based on successful bookings confirmed this month
              </CardDescription>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-3 rounded-2xl border border-border shadow-sm">
              <Award className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-muted/5">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Calculating rankings...</p>
            </div>
          ) : hosts.length > 0 ? (
            hosts.map((host, index) => (
              <div key={host.id || index} className="group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 transition-all hover:bg-muted/30">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 shadow-md transition-transform group-hover:scale-105">
                        <AvatarFallback className="bg-white font-black text-xl uppercase text-primary">
                          {host.firstName[0]}{host.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className="absolute -top-3 -right-3 bg-amber-400 text-white p-1.5 rounded-full border-4 border-white shadow-lg">
                          <Trophy className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                          {host.firstName} {host.lastName}
                        </h3>
                        {host.isSuperHost && (
                          <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter bg-primary text-white">
                            <Sparkles className="h-2.5 w-2.5" />
                            Superhost
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{host.email}</span>
                        </div>
                        <p className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded uppercase opacity-80">
                          {host.hostCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end px-8 py-3 rounded-2xl border bg-card shadow-sm min-w-[140px]">
                    <p className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-[0.2em] mb-1">
                      Final Score
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-4xl font-black leading-none text-primary">
                        {host.totalBookings}
                      </p>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Bookings</span>
                    </div>
                  </div>
                </div>
                {index < hosts.length - 1 && <Separator className="opacity-50" />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10">
              <User className="h-12 w-12 mb-3 opacity-10" />
              <p className="text-sm font-bold">No host data available for this ranking.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TopHosts;