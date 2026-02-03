import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Feedback } from "@/types";

export function TableFeedback({ feedbacks, onDelete }: { feedbacks: Feedback[], onDelete: (id: number) => void }) {
  const [selected, setSelected] = useState<Feedback | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/feedbacks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Feedback deleted");
      onDelete(id);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.userFirstName} {f.userLastName}</TableCell>
              <TableCell>{f.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-amber-500">
                  {f.rating} <Star className="size-3 fill-current" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelected(f)}><Eye className="mr-2 size-4" /> View</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(f.id)}><Trash2 className="mr-2 size-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Rating:</span>
              <span className="font-bold flex items-center gap-1">{selected?.rating} <Star className="size-3 fill-amber-500 text-amber-500" /></span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Comment:</span>
              <p className="leading-relaxed">{selected?.comment}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}