import { api } from "@/lib/axios";

export interface FluxoHorarioResponse {
  hora: string;
  vendas: number;
}

interface GetFluxoHorarioParams {
  inicio?: string;
  fim?: string;
}

export async function getFluxoHorario(params?: GetFluxoHorarioParams) {
  const response = await api.get<FluxoHorarioResponse[]>("/relatorio/fluxo_horario", {
    params
  });
  return response.data;
}
