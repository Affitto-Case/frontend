import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import type { AvgBedsResponse } from "@/types";

export function AvgBedsStats() {
  const [data, setData] = useState<AvgBedsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAvgBeds = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/residences/stats/avg`);
        if (!res.ok) throw new Error("Failed to fetch average beds");
        const result = await res.json();
        setData(result);
      } catch (error) {
        toast.error("Error loading average beds statistic");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvgBeds();
  }, [API_URL]);

  return (
    <Card className="overflow-hidden border-2 border-primary/10 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Average Capacity
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bed className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground italic">Calculating...</span>
          </div>
        ) : data ? (
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-primary">
                {data.avgnumberOfBeds.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                Beds / Residence
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Average across all registered residences
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Data unavailable</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AvgBedsStats;