import { api } from "@/lib/axios";

export interface CloseOrdersBody {
  printer: string
  payment: string
  totalAmount: string
  waiterId: string
  orderId: string
  orderProducts: {
    nomeproduto: string
    quantidade: string
    precounitario: string
    valortotal_item: string
  }[]
}

export interface CloseOrdersResponse {
  message: string
}

export async function postCloseOrder(
  body: CloseOrdersBody
): Promise<CloseOrdersResponse> {
  console.log(body)
  const response = await api.post("/finalizar_venda", {
    id_garcom: body.waiterId,
    meio_pagamento: body.payment,
    numeromesa: body.orderId,
    valor_total: body.totalAmount,
    produtos: body.orderProducts,
    end_impressora: body.printer,
  })

  return response.data
}