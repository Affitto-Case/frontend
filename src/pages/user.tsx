import { useEffect, useState } from "react"
import type { User } from "@/types/index"
import TableUser from "@/components/user/table"
import CreateUserForm from "@/components/user/formUser"
import { toast } from "sonner"
import { Loader2, PlusIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function UserManage() {

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchUser,setSearchUser] = useState("")
  const [open, setOpen] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users`)
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error loading users")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleFormSubmit = (newUser: User) => {
    setUsers(prev => [...prev, newUser])
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.userId === updatedUser.userId ? updatedUser : u))
  }

  const handleUserDeleted = (userId: number) => {
    setUsers(prev => prev.filter(u => u.userId !== userId))
  }

  const filteredUsers = users.filter((u) =>
    u.userFirstName.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.userLastName.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.userEmail.toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.userFirstName.toLowerCase() + " " + u.userLastName.toLowerCase()).includes(searchUser.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4 justify-between">
        <div className="flex items center justify-center gap-4">
        <Users className="size-6" />
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        </div>
        <div className="flex justify-center items-center gap-4">
        <div className="w-48">
              <Input
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="bg-background"
              />
            </div>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="size-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="w-full">
        {/* <div className="lg:col-span-4 rounded-xl border-2 p-1">
          <CreateUserForm onFormSubmit={handleFormSubmit} />
        </div> */}

        <div className="w-full bg-card rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableUser
              users={filteredUsers}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleUserDeleted}
            />
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm onFormSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManage;