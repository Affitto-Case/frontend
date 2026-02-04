import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Booking, User, Feedback, ColorType } from "@/types";
import { colorClasses } from "@/types";
import { cn } from "@/lib/utils";

const feedbackSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  comment: z.string().min(1, "Comment is required").max(500),
  rating: z.string().min(1, "Rating is required"),
  bookingId: z.string().min(1, "Booking is required"),
  userId: z.string().min(1, "User is required"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function CreateFeedbackForm({ onCreated, color }: { onCreated: (f: Feedback) => void, color: ColorType }) {
  const [users, setUsers] = useState<User[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { userId: "", bookingId: "", rating: "5", title: "", comment: "" }
  });

  const selectedUserId = watch("userId");

  useEffect(() => {
    fetch(`${API_URL}/api/v1/users`)
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error loading users"));
  }, [API_URL]);

  useEffect(() => {
    setValue("bookingId", "");
    setUserBookings([]);

    if (!selectedUserId) return;

    const loadBookings = async () => {
      setIsFetchingBookings(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/bookings/user/${selectedUserId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUserBookings(Array.isArray(data) ? data : []);
      } catch {
        toast.error("No bookings found or server error");
        setUserBookings([]); // Ensures it stays empty on error
      } finally {
        setIsFetchingBookings(false);
      }
    };

    loadBookings();
  }, [selectedUserId, setValue, API_URL]);

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          rating: Number(data.rating),
          bookingId: Number(data.bookingId),
          userId: Number(data.userId),
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      toast.success("Feedback submitted");
      reset();
      onCreated(result);
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 bg-white rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label>User</Label>
        <select {...register("userId")} className="flex h-9 w-full rounded-md border border-input px-3 text-sm">
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.userId} value={u.userId}>{u.userFirstName} {u.userLastName}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Booking</Label>
        <select
          {...register("bookingId")}
          disabled={!selectedUserId || isFetchingBookings || userBookings.length === 0}
          className="flex h-9 w-full rounded-md border border-input px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {isFetchingBookings ? "Loading..." : userBookings.length === 0 && selectedUserId ? "No bookings available" : "Select Booking"}
          </option>
          {userBookings.map((b) => (
            <option key={b.id} value={b.id}>#{b.id} - {b.residenceName}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input {...register("title")} />
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <select {...register("rating")} className="flex h-9 w-full rounded-md border border-input px-3 text-sm">
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Comment</Label>
        <Textarea {...register("comment")} />
      </div>

      <Button type="submit" className={cn("w-full", colorClasses[color].button)} disabled={isSubmitting || !selectedUserId || userBookings.length === 0}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Feedback"}
      </Button>
    </form>
  );
}