import { api } from "@/lib/axios";

export interface GetOpenOrdersResponse {
  id: number
  numeromesa: number
  valortotal_comanda: string
}

export async function getOpenOrders(): Promise<GetOpenOrdersResponse[]> {
  const response = await api.get("/listarcomandas")

  return response.data
}