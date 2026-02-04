import { useState } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User, Booking } from "@/types";
import { MoreHorizontalIcon, Calendar, Home, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";


export function LastUserBooking({ users }: { users: User[] }) {
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.userId}>
              <TableCell>
                {user.userFirstName} {user.userLastName}
              </TableCell>
              <TableCell>{user.userEmail}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewLastBooking(user)}>
                      View Last Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Last Booking Details</DialogTitle>
      <DialogDescription>
        Most recent reservation for {selectedUser?.userFirstName} {selectedUser?.userLastName}
      </DialogDescription>
    </DialogHeader>

    {isLoadingBooking ? (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Loading details...</p>
      </div>
    ) : lastBooking ? (
      <div className="space-y-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Residence</h4>
            <p className="text-lg font-semibold">{lastBooking.residenceName}</p>
            <p className="text-sm text-muted-foreground">{lastBooking.residenceAddress}</p>
          </div>
          <div className="text-right">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Booking ID</h4>
            <p className="text-lg font-mono font-bold">#{lastBooking.id}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Check-in</span>
            </div>
            <p className="text-sm font-medium">
              {new Date(lastBooking.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Check-out</span>
            </div>
            <p className="text-sm font-medium">
              {new Date(lastBooking.endDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">Guest Information</span>
          </div>
          <div>
            <p className="text-sm font-medium">{lastBooking.userFirstName} {lastBooking.userLastName}</p>
            <p className="text-xs text-muted-foreground">{lastBooking.userEmail}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">Total stay duration:</span>
          <span className="text-sm font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
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
      <Button variant="outline" onClick={() => setDialogOpen(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  );
}

export default LastUserBooking;