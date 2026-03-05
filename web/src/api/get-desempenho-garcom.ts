import { api } from "@/lib/axios";

export interface DesempenhoGarcomResponse {
  id_garcom: number;
  data_hora: string;
  nome: string;
  valor: number;
}

export async function getDesempenhoGarcom() {
  const response = await api.get<DesempenhoGarcomResponse[]>("/desempenho_garcom");
  return response.data;
}
