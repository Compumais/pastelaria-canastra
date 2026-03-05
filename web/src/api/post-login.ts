import { api } from "@/lib/axios";

export interface LoginBody {
  username: string
  password: string
}

export interface LoginResponse {
  user: {
    adm: number
    id: number
    nome: string
  }
}

export async function postLogin(
  body: LoginBody
): Promise<LoginResponse> {
  const response = await api.post("/login", {
    username: body.username,
    password: body.password,
  })

  if (response.data.error) {
    throw new Error(response.data.error)
  }

  return response.data
}