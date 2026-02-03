import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { MoreHorizontalIcon, Calendar, Home, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

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
    fetchLastBooking(user.id);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">#{user.id}</TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Last Booking</DialogTitle>
            <DialogDescription>
              Most recent booking for
              {selectedUser && ` ${selectedUser.firstName} ${selectedUser.lastName}`}
            </DialogDescription>
          </DialogHeader>

          {isLoadingBooking ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading booking...</p>
              </div>
            </div>
          ) : lastBooking ? (
            <div className="grid gap-4 py-4">
              {/* Booking ID */}
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="text-lg font-semibold">#{lastBooking.id}</p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <UserIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guest</p>
                  <p className="text-lg font-semibold">
                    {lastBooking.userFirstName} {lastBooking.userLastName}
                  </p>
                  <p className="text-sm text-gray-500">{lastBooking.userEmail}</p>
                </div>
              </div>

              {/* Residence Info */}
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Residence</p>
                  <p className="text-lg font-semibold">{lastBooking.residenceName}</p>
                  <p className="text-sm text-gray-500">
                    {lastBooking.residenceAddress}
                  </p>
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-gray-500 mb-1">Check-in</p>
                  <p className="text-xl font-bold text-gray-800">
                    {new Date(lastBooking.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-gray-500 mb-1">Check-out</p>
                  <p className="text-xl font-bold text-gray-800">
                    {new Date(lastBooking.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-700 mb-1">Total Duration</p>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.ceil(
                    (new Date(lastBooking.endDate).getTime() -
                      new Date(lastBooking.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  nights
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No bookings found for this user.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LastUserBooking;