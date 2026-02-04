import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colorClasses, type ColorType, type User, type Booking } from "@/types";
import { MoreHorizontalIcon, Calendar, Home, User as UserIcon, Loader2, History } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


export function LastUserBooking({ users, color: defaultColor }: { users: User[], color?: ColorType }) {
  const location = useLocation()
  const themeColor = (location.state as { themeColor?: ColorType })?.themeColor || defaultColor || "blue"
  const theme = colorClasses[themeColor]

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchLastBooking = async (userId: number) => {
    setIsLoadingBooking(true);
    setLastBooking(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/bookings/user/${userId}/last`);

      if (!res.ok) {
        if (res.status === 404) {
          toast.info("No bookings found for this user");
          return;
        }
        throw new Error("Failed to fetch booking");
      }

      const booking = await res.json();
      setLastBooking(booking);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoadingBooking(false);
    }
  };

  const handleViewLastBooking = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
    fetchLastBooking(user.userId);
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <History className={cn("size-6", theme.icon)} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Last User Bookings</h1>
          <p className="text-sm text-muted-foreground">Trace the most recent activity across all guests</p>
        </div>
      </div>

      <div className={cn("rounded-xl border-2 bg-white shadow-sm overflow-hidden", theme.border)}>
        <Table>
          <TableHeader>
            <TableRow className={cn("hover:bg-transparent", theme.bg)}>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Address</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  {user.userFirstName} {user.userLastName}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.userEmail}</TableCell>
                <TableCell className="text-muted-foreground italic">{user.address}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn("size-8 rounded-full", theme.icon, "hover:bg-muted")}>
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleViewLastBooking(user)} className="cursor-pointer">
                        <History className="mr-2 h-4 w-4" />
                        <span>View Last Booking</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className={cn("h-5 w-5", theme.icon)} />
              Last Booking Details
            </DialogTitle>
            <DialogDescription>
              Most recent reservation for {selectedUser?.userFirstName} {selectedUser?.userLastName}
            </DialogDescription>
          </DialogHeader>

          {isLoadingBooking ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className={cn("h-10 w-10 animate-spin mb-4", theme.icon)} />
              <p className="text-sm text-muted-foreground animate-pulse font-medium">Retrieving booking history...</p>
            </div>
          ) : lastBooking ? (
            <div className="space-y-6 py-4">
              <div className={cn("p-4 rounded-xl border bg-card/50", theme.border)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Residence</h4>
                    <p className="text-lg font-bold leading-tight">{lastBooking.residenceName}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                      <Home className="h-3.5 w-3.5" />
                      <span>{lastBooking.residenceAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">ID</h4>
                    <p className={cn("text-lg font-mono font-black", theme.icon)}>#{lastBooking.id}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn("p-4 rounded-xl border bg-muted/30", theme.border)}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Check-in</span>
                  </div>
                  <p className="text-sm font-semibold">
                    {new Date(lastBooking.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className={cn("p-4 rounded-xl border bg-muted/30", theme.border)}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Check-out</span>
                  </div>
                  <p className="text-sm font-semibold">
                    {new Date(lastBooking.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className={cn("flex items-center justify-between p-4 rounded-xl border", theme.bg, theme.border)}>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-white border shadow-sm", theme.icon)}>
                    <History className="size-4" />
                  </div>
                  <span className="text-sm font-medium">Total stay duration</span>
                </div>
                <span className={cn("text-sm font-black px-4 py-1 rounded-full text-white", theme.button.split(" ")[0])}>
                  {Math.ceil(
                    (new Date(lastBooking.endDate).getTime() - new Date(lastBooking.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                  )} nights
                </span>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">No bookings found for this user.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default LastUserBooking;