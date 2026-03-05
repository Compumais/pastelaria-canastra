import { api } from "@/lib/axios";

export interface GetTotalRevenueOnSixMonthsResponse {
  mes: string
  total_mes: number
}

export async function getTotalRevenueOnSixMonths(): Promise<GetTotalRevenueOnSixMonthsResponse[]> {
  const response = await api.get('/vendas180dias')

  return response.data
}