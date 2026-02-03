import { useState } from "react"
import type { User } from "@/types/index"
import TableUser from "@/components/user/table"
import CreateUserForm from "@/components/user/formUser"

export function UserManage({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const handleFormSubmit = (data: User) => {
    console.log("User created:", data)
    const newUser: User = {
      ...data,
    }

    setUsers(prevUsers => [...prevUsers, newUser])
  }

  const handleUserUpdated = (updatedUser: User) => {
    console.log("User updated:", updatedUser)

    // Aggiorna l'utente nella lista
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userId === updatedUser.userId
          ? { ...updatedUser }
          : user
      )
    )
  }

  const handleUserDeleted = (userId: number) => {
    console.log("User deleted:", userId)
    setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId))
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="rounded-lg shadow-md p-6 mb-8">
          <CreateUserForm onFormSubmit={handleFormSubmit} />
        </div>
        <TableUser
          users={users}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      </div>
    </div>
  )
}

export default UserManage