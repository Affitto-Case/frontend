import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { colorClasses, type ColorType, type Residence } from "@/types";
import { TrendingUp, Home, Inbox, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


export function MostPopularResidence({ color: defaultColor }: { color?: ColorType }) {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]

  const [residences, setResidences] = useState<Residence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    setIsLoading(true);
    const fetchResidences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/residences/stats/mprlm`)
        if (!res.ok) {
          throw new Error("Failed to fetch residences")
        }
        const residencesResp = await res.json();
        setResidences(residencesResp)
        toast.success("Data loaded successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchResidences();
  }, [API_URL])

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <TrendingUp className={cn("size-6", theme.icon)} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Market Highlights</h1>
          <p className="text-sm text-muted-foreground">Uncover the most sought-after properties this month</p>
        </div>
      </div>

      <Card className={cn("border-2 shadow-xl overflow-hidden", theme.border)}>
        <CardHeader className={cn("pb-8", theme.bg)}>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Most Popular Residences</CardTitle>
              <CardDescription className="text-muted-foreground/80 font-medium">
                Ranking determined by highest booking volume over the last 30 days
              </CardDescription>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-white shadow-sm">
              <Star className={cn("h-6 w-6 fill-current", theme.icon)} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {residences && residences.length > 0 ? (
            residences.map((r, index) => (
              <div key={r.id || index} className="group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 transition-all hover:bg-muted/30">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-105", theme.bg, theme.border)}>
                        <Home className={cn("h-8 w-8", theme.icon)} />
                      </div>
                      <div className={cn("absolute -top-3 -left-3 h-8 w-8 rounded-full text-xs font-black text-white flex items-center justify-center border-4 border-white shadow-md", theme.button.split(" ")[0])}>
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">{r.name}</h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm font-medium">{r.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className={cn("flex flex-col items-center md:items-end px-6 py-2 rounded-xl border-l-4", theme.border, theme.bg)}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1">Status</span>
                    <span className={cn("text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white border", theme.icon)}>Hot Listing</span>
                  </div>
                </div>
                {index < residences.length - 1 && <Separator className="opacity-50" />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/10">
              <div className="bg-white p-6 rounded-full border shadow-sm mb-4">
                <Inbox className="h-12 w-12 opacity-20" />
              </div>
              <p className="text-sm font-semibold">No popular residences found for this period.</p>
              <p className="text-xs opacity-60">Check back later for updated rankings.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MostPopularResidence