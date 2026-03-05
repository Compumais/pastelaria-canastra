import { api } from "@/lib/axios";

interface GetVendasPeriodoParams {
  inicio: string; // DD-MM-YYYY
  fim: string;    // DD-MM-YYYY
  formato?: string;
}

export async function getVendasPeriodoRelatorio({ inicio, fim, formato = "txt" }: GetVendasPeriodoParams) {
  const response = await api.get("/relatorio/vendas", {
    params: { inicio, fim, formato },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `relatorio_vendas_${inicio}_${fim}.${formato}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
