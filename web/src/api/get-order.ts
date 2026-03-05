import { api } from "@/lib/axios";

interface GetOrderResponse {
  id: number,
  idcontamesa: number
  nomeproduto: string
  precounitario: string
  quantidade: string
  valortotal_comanda: string
  valortotal_item: string
  idgarcom: number
}

export async function getOrder(
  orderId: number
): Promise<GetOrderResponse[]> {
  const response = await api.get(`/comanda/${orderId.toString()}`)

  return response.data
}