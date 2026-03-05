"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getOrder } from "@/api/get-order";
import { postCloseOrder } from "@/api/post-close-orders";

import { OrdersDetailSkeleton } from "./orders-detail-skeleton";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { notFound } from "next/navigation";
import { useCashClose } from "@/context/cash-close-context";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getPrinters } from "@/api/get-printers";

const closeOrdersSchema = z.object({
  payment: z.string(),
})

type CloseOrdersSchema = z.infer<typeof closeOrdersSchema>

interface OrdersDetailProps {
  orderId?: number;
  open: boolean;
  onClose: () => void;
  setOrderId: (value: SetStateAction<number | undefined>) => void
}

export function OrdersDetail({ orderId, open, onClose, setOrderId }: OrdersDetailProps) {
  const { onCashCloseSum } = useCashClose()
  const [activeButton, setActiveButton] = useState("pix")
  const [selectedPrinter, setSelectedPrinter] = useState("")

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<CloseOrdersSchema>({
    resolver: async (data) => {
      const result = closeOrdersSchema.safeParse(data);
      if (result.success) return { values: result.data, errors: {} };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { values: {}, errors: result.error.flatten() as unknown as any };
    },
    defaultValues: {
      payment: "",
    }
  })

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId && open,
  });

  const handleCloseOrder = async (data: CloseOrdersSchema) => {
    if (!order || !order[0] || !orderId) {
      throw new Error("Pedido não carregado.");
    }

    try {
      await closeOrder({
        orderId: orderId.toString(),
        payment: data.payment,
        totalAmount: order[0].valortotal_comanda,
        waiterId: order[0].idgarcom.toString(),
        orderProducts: order,
        printer: selectedPrinter,
      })

      setValue("payment", "")
      setOrderId(undefined)
      onCashCloseSum(Number(order[0].valortotal_comanda))
      onClose()

      toast.success("Comanda fechada com sucesso!", {
        position: "top-center",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Falha ao fechar comanda, tente novamente!" + message, {
        position: "top-center",
      })
    }
  }

  const { mutateAsync: closeOrder } = useMutation({
    mutationFn: postCloseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-orders'] })
    }
  })

  const { data: printers } = useQuery({
    queryKey: ["printers"],
    queryFn: getPrinters
  })


  if (!orderId) {
    return notFound()
  }

  return (
    <form onSubmit={handleSubmit(handleCloseOrder)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comanda: {orderId}</DialogTitle>
          <DialogDescription>Detalhes do pedido</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead className="text-right">Valor Unitário</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <OrdersDetailSkeleton />}
              {
                order ? (
                  order.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nomeproduto}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.precounitario))}
                      </TableCell>

                      <TableCell className="text-right">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.valortotal_item))}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <OrdersDetailSkeleton />
                )
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-right">
                  Total:
                </TableCell>
                <TableCell className="font-bold text-right">
                  {order ? (
                    <span>
                      {
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(order[0].valortotal_comanda))
                      }
                    </span>
                  ) : (
                    <Skeleton className="w-full h-5 bg-gray-300" />
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="space-y-2">
            <Label>Impressora</Label>
            <Select onValueChange={setSelectedPrinter}>
              <SelectTrigger className="border-blue-500">
                <SelectValue placeholder="Selecione a impressora" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {printers?.map((printer) => (
                  <SelectItem key={printer.id} value={printer.ip.toString()}>
                    {printer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-36 cursor-pointer"
              onClick={() => {
                setValue("payment", "dinheiro");
                handleSubmit(handleCloseOrder)();
              }}
            >
              Dinheiro
            </Button>

            <Button
              disabled
              variant="destructive"
              data-active={activeButton === "pix"}
              className="w-36 cursor-pointer"
              onClick={() => setActiveButton("pix")}
              {...register("payment")}
            >
              Pix
            </Button>

            <Button
              disabled
              variant="destructive"
              data-active={activeButton === "credit"}
              className="w-36 cursor-pointer"
              onClick={() => setActiveButton("credit")}
              {...register("payment")}
            >
              Cartão
            </Button>
          </div>
        </div>
      </DialogContent>
    </form>
  );
}