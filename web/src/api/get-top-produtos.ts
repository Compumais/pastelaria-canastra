import { api } from "@/lib/axios";

export interface TopProdutosResponse {
  produto: string;
  quantidade: number;
}

export interface GetTopProdutosQuery {
  inicio?: string;
  fim?: string;
}

export async function getTopProdutos({ inicio, fim }: GetTopProdutosQuery): Promise<TopProdutosResponse[]> {
  const response = await api.get('/relatorio/top_produtos', {
    params: { inicio, fim }
  });

  return response.data;
}
