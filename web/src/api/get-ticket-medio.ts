import { api } from "@/lib/axios";

export interface TicketMedioResponse {
  ticket_medio: number;
  total_faturado: number;
  total_vendas: number;
}

interface GetTicketMedioParams {
  inicio?: string;
  fim?: string;
}

export async function getTicketMedio(params?: GetTicketMedioParams) {
  const response = await api.get<TicketMedioResponse>("/relatorio/ticket_medio", {
    params
  });
  return response.data;
}
