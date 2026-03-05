import { api } from "@/lib/axios";

export interface Closeds {
  id: number
  data_hora: string
  total_abertura: number
  observacao: string
  operador: string
  total_caixa: number
  total_contado: number
}

export interface GetCloseCashesResponse {
  page: number
  per_page: number
  total_count: number,
  fechamentos: Closeds[]
}

export interface GetCloseCashesParams {
  pageIndex?: number
}

export async function getCloseCashes({
  pageIndex
}: GetCloseCashesParams): Promise<GetCloseCashesResponse> {
  const response = await api.get("/listar_fechamentos", {
    params: {
      page: pageIndex ? pageIndex + 1 : 1,
    }
  })

  return response.data
}