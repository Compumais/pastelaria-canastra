import { api } from "@/lib/axios";

export interface GetDayRevenueResponse {
  total_vendas: number
  total_fechadas: number
}

export async function getDayRevenue(): Promise<GetDayRevenueResponse> {
  const response = await api.get("/total_dia")

  return response.data
}