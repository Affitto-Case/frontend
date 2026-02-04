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
import type { TableUserProps, User } from "@/types"



export function TableUser({ users, onUserUpdated, onUserDeleted }: TableUserProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<User | null>(null)

  const API_URL = import.meta.env.VITE_API_URL

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({ ...user })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!formData) return
    
    const userReq = {
      firstName: formData.userFirstName,
      lastName: formData.userLastName,
      email: formData.userEmail,
      address: formData.address
    }
    
    try {
      const res = await fetch(`${API_URL}/api/v1/users/${formData.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userReq),
      })

      if (!res.ok) {
        throw new Error("Failed to update user")
      }

      const updatedUser: User = await res.json()
      
      toast.success("User updated successfully")
      setEditDialogOpen(false)
      
      // Chiama il callback per aggiornare lo stato nel componente padre
      if (onUserUpdated) {
        onUserUpdated(updatedUser)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error: " + error.message)
      }
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return

    try {
      const res = await fetch(`${API_URL}/api/v1/users/${selectedUser.userId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete user")
      }

      toast.success("User deleted successfully")
      setDeleteDialogOpen(false)
      
      if (onUserDeleted) {
        onUserDeleted(selectedUser.userId)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  // Update form data
  const handleInputChange = (field: keyof User, value: string | number) => {
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
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Registration date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.userId}>
              <TableCell className="font-medium">{u.userFirstName}</TableCell>
              <TableCell>{u.userLastName}</TableCell>
              <TableCell>{u.userEmail}</TableCell>
              <TableCell>{u.address}</TableCell>
              <TableCell>{u.registrationDate}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(u)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(u)}
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details of the user below.
            </DialogDescription>
          </DialogHeader>

          {formData && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.userFirstName}
                  onChange={(e) => handleInputChange("userFirstName", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.userLastName}
                  onChange={(e) => handleInputChange("userLastName", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => handleInputChange("userEmail", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Name:</span> {selectedUser.userFirstName} {selectedUser.userLastName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {selectedUser.userEmail}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Address:</span> {selectedUser.address}
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

export default TableUser