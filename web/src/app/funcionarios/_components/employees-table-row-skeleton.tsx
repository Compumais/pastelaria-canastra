import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"
import { Edit2, Trash2 } from "lucide-react"

export function EmployeesTableRowSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-7 bg-gray-200" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-full bg-gray-200" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-full bg-gray-200" />
        </TableCell>

        <TableCell>
          <Button variant="ghost">
            <Edit2 />
          </Button>
        </TableCell>

        <TableCell>
          <Button variant="ghost">
            <Trash2 className="text-red-800" />
          </Button>
        </TableCell>
      </TableRow>
    )
  })
}