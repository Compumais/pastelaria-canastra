import { GetOrdersResponse } from "@/api/get-close-orders";

import {
  TableCell,
  TableRow,
} from "./ui/table";

interface LastFiveOrdersTableProps {
  orders: Pick<GetOrdersResponse, "vendas">
}

export function LastFiveOrdersTable({
  orders
}: LastFiveOrdersTableProps) {
  console.log(orders)
  return (
    <>
      {orders.vendas.slice(0, 5).map((item) => (
        <TableRow key={item.id}>
          <TableCell className="text-xs font-medium">{item.numero_comanda}</TableCell>
          <TableCell className="text-xs">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL"
            }).format(item.valor_total)}
          </TableCell>
          <TableCell className="text-xs">
            {item.data_hora}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}