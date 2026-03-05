import { api } from "@/lib/axios";

export interface CloseOrdersBody {
  user: string
  cashOpenTotal: string
  cashCloseTotal: string
  cashCloseTotalCurrent: string
  observation?: string
  printer: string
}

export interface CloseOrdersResponse {
  message: string
}

export async function postCashClose(
  body: CloseOrdersBody
): Promise<CloseOrdersResponse> {
  const response = await api.post("/fechamento", {
    total_caixa: body.cashCloseTotal,
    total_contado: body.cashCloseTotalCurrent,
    total_abertura: body.cashOpenTotal,
    observacao: body.observation,
    operador: body.user,
    end_imp: body.printer,
  })

  return response.data
}