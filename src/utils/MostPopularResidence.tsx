import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Residence } from "@/types";
import { TrendingUp, Home, Star, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function MostPopularResidence() {

    const [residences,setResidences] = useState<Residence[]> ([])
    const [isLoading, setIsLoading] = useState(true)
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(()=>{
    setIsLoading(true);
    const fetchResidences = async () => {
      try{
        const res = await fetch(`${API_URL}/api/v1/residences/stats/mprlm`)
        if(!res.ok){
          throw new Error("Failed to fetch residences")
        }
        const residencesResp = await res.json();
        setResidences(residencesResp)
        toast.success("Data loaded successfully");
      } catch (error){
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchResidences();
  },[])

return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Monthly Insights</h2>
      </div>

      <Card className="border-2 border-primary/10 shadow-md">
        <CardHeader className="bg-primary/5 pb-6">
          <CardTitle className="text-2xl">Most Popular Residences</CardTitle>
          <CardDescription>
            Ranking based on booking volume from the last 30 days
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0"> {/* P-0 per far arrivare il separatore ai bordi */}
          {residences && residences.length > 0 ? (
            residences.map((r, index) => (
              <div key={r.id || index}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
                        <Home className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-none mb-1">{r.name}</h3>
                      <p className="text-sm text-muted-foreground">{r.address}</p>
                    </div>
                  </div>
                </div>
                {index < residences.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Inbox className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">No popular residences found this month.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MostPopularResidence