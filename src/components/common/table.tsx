import { Button } from "@/components/ui/button"
import { Star, MoreHorizontalIcon, ArrowUpIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User, Host } from "@/types"




export function TableCrud({ users, hosts, handlePromoteClick, handleViewClick, handleDeleteClick, className }: { users?: User[], hosts?: Host[], handlePromoteClick?: (user: User) => void, handleViewClick?: (host: Host) => void, handleDeleteClick?: (host: Host) => void, className?: string }) {

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {(users || hosts) && <TableHead>Name</TableHead>}
            {(users || hosts) && <TableHead>Surname</TableHead>}
            {(users || hosts) && <TableHead>Email</TableHead>}
            {hosts && <TableHead>Total Bookings</TableHead>}
            {hosts && <TableHead>Superhost</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hosts &&
            hosts.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">
                  {h.firstName}
                </TableCell>
                <TableCell className="font-medium">{h.lastName}</TableCell>
                <TableCell>{h.email}</TableCell>
                <TableCell>{h.totalBookings}</TableCell>
                <TableCell>
                  {h.isSuperHost ? (
                    <div className="flex items-center text-yellow-600 gap-1">
                      <Star className="size-4 fill-current" />
                      <span className="text-xs font-bold uppercase tracking-tighter">Superhost</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-tighter">Standard Host</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {
                        handleViewClick && (
                          <DropdownMenuItem onClick={() => handleViewClick(h)}>
                            View Profile
                          </DropdownMenuItem>
                        )
                      }
                      <DropdownMenuSeparator />
                      {
                        handleDeleteClick && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(h)}
                          >
                            Remove Host
                          </DropdownMenuItem>
                        )
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          {
            users &&
            users.map((u) => (
              <TableRow key={u.userId}>
                <TableCell className="font-medium">
                  {u.userFirstName}
                </TableCell>
                <TableCell className="font-medium">{u.userLastName}</TableCell>
                <TableCell>{u.userEmail}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {
                        handlePromoteClick && (
                          <DropdownMenuItem onClick={() => handlePromoteClick(u)}>
                            <ArrowUpIcon className="size-4" />
                            Promote to Host
                          </DropdownMenuItem>
                        )
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}