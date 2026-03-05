import { api } from "@/lib/axios";

export interface DeleteUsersParams {
  id: number
}

export async function deleteUser({ id }: DeleteUsersParams): Promise<void> {
  await api.delete(`/deletar_usuario/${id}`)
}