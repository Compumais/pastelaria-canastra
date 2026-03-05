import { api } from "@/lib/axios";

export async function deletePrinter(id: number) {
  await api.delete(`/deletar_impressora/${id}`)
}
