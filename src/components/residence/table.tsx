import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"
import type { Residence } from "@/types"

// Definiamo l'interfaccia delle Props con callback opzionali
interface TableResidenceProps {
  residences: Residence[];
  onResidenceUpdated?: (updated: Residence) => void; // Opzionale
  onResidenceDeleted?: (id: number) => void;        // Opzionale
}

export function TableResidence({ 
  residences, 
  onResidenceUpdated, 
  onResidenceDeleted 
}: TableResidenceProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null)
  const [formData, setFormData] = useState<Residence | null>(null)

  const API_URL = import.meta.env.VITE_API_URL

  const handleEdit = (residence: Residence) => {
    setSelectedResidence(residence)
    setFormData({ ...residence })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (residence: Residence) => {
    setSelectedResidence(residence)
    setDeleteDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!formData) return
    
    // Costruiamo l'oggetto richiesta (escludendo l'ID dal body se necessario)
    const residenceReq = {
      name: formData.name,
      address: formData.address,
      numberOfRooms: formData.numberOfRooms,
      guestCapacity: formData.guestCapacity, 
      floor: formData.floor,
      price: formData.price,
      availableFrom: formData.availableFrom, 
      availableTo: formData.availableTo,     
      hostId: formData.hostId      
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/residences/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(residenceReq),
      })

      if (!res.ok) throw new Error("Failed to update residence")

      toast.success("Residence updated successfully")
      
      // Chiamiamo la callback se esiste per aggiornare lo stato del padre
      if (onResidenceUpdated) {
        onResidenceUpdated(formData)
      }
      
      setEditDialogOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error: " + error.message)
      }
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedResidence || !selectedResidence.id) return

    try {
      const res = await fetch(`${API_URL}/api/v1/residences/${selectedResidence.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete residence")

      toast.success("Residence deleted successfully")
      
      // Chiamiamo la callback se esiste per rimuovere l'elemento dallo stato del padre
      if (onResidenceDeleted) {
        onResidenceDeleted(selectedResidence.id)
      }
      
      setDeleteDialogOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleInputChange = (field: keyof Residence, value: string | number) => {
    if (!formData) return
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Beds</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residences.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>{r.address}</TableCell>
              <TableCell>{r.numberOfRooms}</TableCell>
              <TableCell>{r.guestCapacity}</TableCell>
              <TableCell>${r.price}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(r)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(r)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* EDIT DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Residence</DialogTitle>
            <DialogDescription>
              Update the details of the residence below.
            </DialogDescription>
          </DialogHeader>

          {formData && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numberOfRooms">Number of Rooms</Label>
                  <Input
                    id="numberOfRooms"
                    type="number"
                    value={formData.numberOfRooms}
                    onChange={(e) =>
                      handleInputChange("numberOfRooms", parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="numberOfBeds">Number of Beds</Label>
                  <Input
                    id="numberOfBeds"
                    type="number"
                    value={formData.guestCapacity}
                    onChange={(e) =>
                      handleInputChange("guestCapacity", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) =>
                      handleInputChange("floor", parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange("price", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.availableTo}
                    onChange={(e) => handleInputChange("availableTo", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Residence</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this residence? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedResidence && (
            <div className="py-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Name:</span> {selectedResidence.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Address:</span>{" "}
                {selectedResidence.address}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableResidence