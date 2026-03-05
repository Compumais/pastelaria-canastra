import { api } from "@/lib/axios";

interface PutEditPrinterRequest {
  id: number
  name: string
  ip: string
  port: string
}

export async function putEditPrinter({ id, ...data }: PutEditPrinterRequest) {
  await api.put(`/atualizar_impressora/${id}`, data)
}
