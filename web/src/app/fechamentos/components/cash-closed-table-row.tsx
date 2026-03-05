import type { Closeds } from "@/api/get-close-cashes";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CashClosedTableRowProps {
  data: Closeds;
}

export function CashClosedTableRow({ data }: CashClosedTableRowProps) {
  const difference = data.total_caixa - data.total_contado;

  return (
    <TableRow>
      <TableCell>{data.total_caixa}</TableCell>
      <TableCell>{data.total_contado}</TableCell>
      <TableCell>{data.total_abertura}</TableCell>
      <TableCell>
        { difference > 0 ? Number(difference.toFixed(2)) * 1 : Number(difference.toFixed(2)) * -1}
      </TableCell>
      <TableCell>{data.operador}</TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!data.observacao} variant="outline" size="sm">
              Ver observação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Observação</DialogTitle>
              <DialogDescription>
                { data.observacao }
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>

      <TableCell>
        { data.data_hora }
      </TableCell>
    </TableRow>
  );
}
