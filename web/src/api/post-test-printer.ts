import { api } from "@/lib/axios";

interface PostTestPrinterRequest {
  ip: string
  port: string
}

export async function postTestPrinter(data: PostTestPrinterRequest) {
  await api.post("/testar_impressora", data)
}
