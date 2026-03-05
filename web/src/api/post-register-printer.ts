import { api } from "@/lib/axios";

interface PostRegisterPrinterRequest {
  name: string
  ip: string
  port: string
}

export async function postRegisterPrinter(data: PostRegisterPrinterRequest) {
  await api.post("/cadastrar_impressora", data)
}
