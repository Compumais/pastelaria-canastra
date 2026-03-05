import { api } from "@/lib/axios";

export interface GetUsersResponse {
  page: number
  per_page: number
  total_usuarios: number
  usuarios: {
    id: number
    adm: number
    nome: string
    senha: string
  }[]
}

export interface GetUsersParams {
  pageIndex?: number
}

export async function getUsers({
  pageIndex,
}: GetUsersParams): Promise<GetUsersResponse> {
  const response = await api.get("/listar_usuarios", {
    params: {
      page: pageIndex ? pageIndex + 1 : 1,
    }
  })

  return response.data
}