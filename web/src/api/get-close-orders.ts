import { api } from "@/lib/axios";

export interface Order {
  id: number
  data_hora: string
  id_garcom: number | null
  meio_pagamento: string,
  numero_comanda: number
  valor_total: number
}

export interface GetOrdersResponse {
  page: number
  per_page: number
  total_count: number
  vendas: Order[]
}

export interface GetOrdersParams {
  orderId?: number | null
  pageIndex?: number | null
}


export async function getCloseOrders({
  orderId,
  pageIndex,
}: GetOrdersParams): Promise<GetOrdersResponse> {
  const response = await api.get("/finalizadas", {
    params: {
      numero_comanda: orderId,
      page: pageIndex ? pageIndex + 1 : 1,
    }
  })

  console.log(response.data.vendas)

  return response.data
}