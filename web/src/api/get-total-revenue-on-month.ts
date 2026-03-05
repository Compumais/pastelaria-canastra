import { api } from "@/lib/axios";

export interface GetTotalRevenueOnMonthResponse {
  data: string
  valor: number
}

export async function getTotalRevenueOnMonth(): Promise<GetTotalRevenueOnMonthResponse[]> {
  const response = await api.get('/vendasmesatual')
  
  return response.data
}