import { api } from "@/lib/axios";

export interface EditUserBody {
  params: {
    id: number
  }
  body: {
    username: string
    password: string
  }
}

export async function putEditUser({
  body,
  params
}: EditUserBody): Promise<void> {
  const response = await api.put(`/atualizar_usuario/${params.id}`, {
    nome: body.username,
    senha: body.password,
  })

  if (response.data.error) {
    throw new Error(response.data.error)
  }

  return response.data
}