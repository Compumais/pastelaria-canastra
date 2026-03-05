import { api } from "@/lib/axios";

export interface GetPrintersResponse {
  id: number
  ip: string
  name: string
  port: string
}

export async function getPrinters(): Promise<GetPrintersResponse[]> {
  const response = await api.get("/listar_impressoras")

  return response.data
}