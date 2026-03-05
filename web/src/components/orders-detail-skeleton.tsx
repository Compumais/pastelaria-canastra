import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

export function OrdersDetailSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      </TableRow>
    )
  })
}