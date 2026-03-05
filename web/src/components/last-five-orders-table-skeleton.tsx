import { Skeleton } from "./ui/skeleton"
import { TableCell, TableRow } from "./ui/table"

export function LastFiveOrdersTableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-300" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-300" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-5 w-full bg-gray-300" />
        </TableCell>
      </TableRow>
    )
  })
}