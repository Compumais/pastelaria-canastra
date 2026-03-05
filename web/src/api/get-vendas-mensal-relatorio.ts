import { api } from "@/lib/axios";

interface GetVendasMensalParams {
  mes: string; // MM
  ano: string; // YYYY
  formato?: string;
}

export async function getVendasMensalRelatorio({ mes, ano, formato = "txt" }: GetVendasMensalParams) {
  const response = await api.get("/relatorio/mensal", {
    params: { mes, ano, formato },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `relatorio_mensal_${mes}_${ano}.${formato}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
