import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

export function OpenOrdersButtonSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => {
    return (
      <Button key={i}>
        <Skeleton className="w-2 h-2" />
      </Button>
    )
  }
)
}