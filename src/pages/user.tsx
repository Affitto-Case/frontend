import { useEffect, useState } from "react"
import type { User } from "@/types/index"
import TableUser from "@/components/user/table"
import CreateUserForm from "@/components/user/formUser"
import { toast } from "sonner"
import { Loader2, Users } from "lucide-react"

export function UserManage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Users className="size-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <CreateUserForm onFormSubmit={handleFormSubmit} />
        </div>

        <div className="lg:col-span-8 bg-white rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TableUser
              users={users}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleUserDeleted}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default UserManage