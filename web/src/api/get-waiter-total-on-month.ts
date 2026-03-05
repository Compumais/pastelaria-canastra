import { api } from "@/lib/axios";

export interface GetWaiterTotalOnMonthResponse {
  id_garcom: number
  nome: string
  valor: string
}

export async function getWaiterTotalOnMonth(): Promise<GetWaiterTotalOnMonthResponse[]> {
  const response = await api.get("/desempenho_garcom")

  return response.data
}