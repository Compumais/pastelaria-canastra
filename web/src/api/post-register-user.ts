import { api } from "@/lib/axios";

export interface RegisterUserBody {
  username: string
  password: string
}

export interface RegisterUserResponse {
  message: string
}

export async function postRegisterUser(
  body: RegisterUserBody
): Promise<RegisterUserResponse> {
  const response = await api.post("/cadastrar_usuario", {
    data: new Date().toLocaleTimeString(),
    nome: body.username,
    senha: body.password,
    adm: 0,
  })

  if (response.data.error) {
    throw new Error(response.data.error)
  }

  return response.data
}