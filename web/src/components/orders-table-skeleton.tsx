import { Edit2 } from "lucide-react"

import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { TableCell, TableRow } from "./ui/table"

export function OrdersTableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-200" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-200" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-200" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-200" />
        </TableCell>

        <TableCell className="text-right">
          <Button disabled className="w-8 h-8 cursor-pointer disabled:bg-red-700">
            <Edit2 className="w-2 h-2" />
          </Button>
        </TableCell>
      </TableRow>
    )
  })
}