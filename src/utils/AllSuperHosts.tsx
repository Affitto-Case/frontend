import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, User, Mail, ShieldCheck, Loader2, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Host } from "@/types";

export function SuperHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSuperHosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/super_hosts`);
        if (!res.ok) throw new Error("Failed to fetch super hosts");
        const data = await res.json();
        setHosts(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuperHosts();
  }, [API_URL]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <ShieldCheck className="size-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">SuperHost Directory</h1>
      </div>

      <Card className="border-2 border-primary/10 shadow-md">
        <CardHeader className="bg-primary/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Award className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Certified SuperHosts</CardTitle>
              <CardDescription>
                A complete list of our most trusted and high-performing partners
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-sm font-medium text-muted-foreground tracking-wide">
                Verifying certifications...
              </p>
            </div>
          ) : hosts.length > 0 ? (
            hosts.map((host, index) => (
              <div key={host.id || index}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-5">
                    {/* Avatar with Status Ring */}
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-primary shadow-sm">
                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg uppercase">
                          {host.firstName[0]}{host.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white shadow-sm">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold leading-none tracking-tight">
                        {host.firstName} {host.lastName}
                      </h3>
                      <div className="flex flex-wrap gap-y-2 gap-x-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{host.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Joined {new Date(host.registrationDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-mono font-bold uppercase text-primary/70">
                        Host Reference: {host.hostCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center md:text-right px-6 border-l border-muted">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">
                        Lifetime Bookings
                      </p>
                      <p className="text-3xl font-black text-primary leading-none">
                        {host.totalBookings}
                      </p>
                    </div>
                  </div>
                </div>
                {index < hosts.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <User className="h-12 w-12 mb-3 opacity-10" />
              <p className="text-sm font-medium">No SuperHosts found in the database.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SuperHosts;