import { Edit2 } from "lucide-react";

import type { Order } from "@/api/get-close-orders";

import { Button } from "./ui/button";
import { TableCell,TableRow } from "./ui/table";

interface OrdersTableProps {
  order: Order
}

export function OrdersTable({ order }: OrdersTableProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{order.numero_comanda}</TableCell>

      <TableCell>{new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(order.valor_total)}</TableCell>

      <TableCell>{order.meio_pagamento.toUpperCase()}</TableCell>

      <TableCell>
        {order.data_hora}
      </TableCell>

      <TableCell className="text-right">
        <Button disabled className="w-8 h-8 cursor-pointer disabled:bg-red-700">
          <Edit2 className="w-2 h-2" />
        </Button>
      </TableCell>
    </TableRow>
  )
}