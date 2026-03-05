import { api } from "@/lib/axios";

export interface GetUserParams {
  userId: number
}

export interface GetUsersResponse {
  id: number
  adm: number
  nome: string
  senha: string
}

export async function getUser({ userId }: GetUserParams): Promise<GetUsersResponse> {
  const response = await api.get(`/buscar_usuario/${userId}`)

  if (response.data.error) {
    throw new Error("Usuário não encontrado")
  }

  return response.data[0]
}