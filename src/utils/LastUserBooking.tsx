import { useEffect, useState } from "react";
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
import { type User, type Booking } from "@/types";
import { MoreHorizontalIcon, Calendar, Home, User as UserIcon, Loader2, History } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";


export function LastUserBooking() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);


    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`${API_URL}/api/v1/users`)
          if (!res.ok) throw new Error("Failed to fetch users")
          const data = await res.json()
          setUsers(data)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Error loading users")
        } 
      }
      fetchUsers()
    }, [])

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

  const filteredUsers = users.filter((user) =>
    user.userFirstName.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.userLastName.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.userEmail.toLowerCase().includes(searchUser.toLowerCase()) ||
    (user.userFirstName.toLowerCase() + " " + user.userLastName.toLowerCase()).includes(searchUser.toLowerCase())
  );


  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <History className="size-6" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Last User Bookings</h1>
          <p className="text-sm text-muted-foreground">Trace the most recent activity across all guests</p>
        </div>
      </div>
      <div className="w-64">
        <Input
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="bg-background"
        />
      </div>
      <div className="rounded-xl border-2 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/20">
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Surname</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Address</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.userId} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  {user.userFirstName}
                </TableCell>
                <TableCell className="font-medium">{user.userLastName}</TableCell>
                <TableCell className="text-muted-foreground">{user.userEmail}</TableCell>
                <TableCell className="text-muted-foreground italic">{user.address}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
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
              <UserIcon className="h-5 w-5 text-primary" />
              Last Booking Details
            </DialogTitle>
            <DialogDescription>
              Most recent reservation for {selectedUser?.userFirstName} {selectedUser?.userLastName}
            </DialogDescription>
          </DialogHeader>

          {isLoadingBooking ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse font-medium">Retrieving booking history...</p>
            </div>
          ) : lastBooking ? (
            <div className="space-y-6 py-4">
              <div className="p-4 rounded-xl border bg-card/50">
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
                    <p className="text-lg font-mono font-black text-primary">#{lastBooking.id}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-muted/30">
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
                <div className="p-4 rounded-xl border bg-muted/30">
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

              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-card border shadow-sm text-primary">
                    <History className="size-4" />
                  </div>
                  <span className="text-sm font-medium">Total stay duration</span>
                </div>
                <span className="text-sm font-black px-4 py-1 rounded-full text-white bg-primary">
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