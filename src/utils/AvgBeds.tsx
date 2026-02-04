import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { colorClasses, type ColorType, type AvgBedsResponse } from "@/types";
import { cn } from "@/lib/utils";

export function AvgBedsStats({ color: defaultColor }: { color?: ColorType }) {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]

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
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Bed className={cn("size-6", theme.icon)} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Average Capacity</h1>
          <p className="text-sm text-muted-foreground">Statistics overview for all residences</p>
        </div>
      </div>

      <Card className={cn("max-w-md mx-auto overflow-hidden border-2 shadow-sm transition-all hover:shadow-md", theme.border)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Average Bed Count
            </CardTitle>
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", theme.bg)}>
              <Bed className={cn("h-5 w-5", theme.icon)} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 py-6">
              <Loader2 className={cn("h-5 w-5 animate-spin", theme.icon)} />
              <span className="text-sm text-muted-foreground font-medium animate-pulse">Computing average...</span>
            </div>
          ) : data ? (
            <div className="space-y-4 py-2">
              <div className="flex items-baseline gap-2">
                <span className={cn("text-5xl font-black tracking-tighter", theme.icon)}>
                  {data.avgnumberOfBeds.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Beds / Residence
                </span>
              </div>
              <div className={cn("flex items-center gap-2 p-3 rounded-lg border text-xs leading-relaxed", theme.bg, theme.border)}>
                <Info className={cn("h-4 w-4 shrink-0", theme.icon)} />
                <p className="font-medium">Calculated across all property listings currently active in the system.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Data unavailable</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AvgBedsStats;