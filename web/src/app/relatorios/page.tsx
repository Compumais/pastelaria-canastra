"use client";

import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  BarChart3,
  Users,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getVendasPeriodoRelatorio } from "@/api/get-vendas-periodo-relatorio";
import { getVendasMensalRelatorio } from "@/api/get-vendas-mensal-relatorio";
import { getDesempenhoGarcom } from "@/api/get-desempenho-garcom";
import { getFluxoHorario } from "@/api/get-fluxo-horario";
import { getTicketMedio } from "@/api/get-ticket-medio";
import { ReportCard } from "./components/report-card";
import { ReportParamDialog, ReportType } from "./components/report-param-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultLayout } from "@/components/default-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function RelatoriosPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportParams, setReportParams] = useState<Record<string, string | undefined>>({});

  const { data: desempenho, isLoading: isLoadingDesempenho, refetch: refetchDesempenho } = useQuery({
    queryKey: ["desempenho-garcom"],
    queryFn: getDesempenhoGarcom,
    enabled: false,
  });

  const { data: fluxo, refetch: refetchFluxo } = useQuery({
    queryKey: ["fluxo-horario", reportParams],
    queryFn: () => getFluxoHorario(reportParams),
    enabled: false,
  });

  const { data: ticket, refetch: refetchTicket } = useQuery({
    queryKey: ["ticket-medio", reportParams],
    queryFn: () => getTicketMedio(reportParams),
    enabled: false,
  });

  const handleCardClick = (type: ReportType) => {
    setSelectedReport(type);
    setIsDialogOpen(true);
  };

  const formatToApiDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleGenerateReport = async (params: Record<string, string>) => {
    try {
      if (selectedReport === "periodo") {
        if (!params.inicio || !params.fim) {
          toast.error("Datas de início e fim são obrigatórias");
          return;
        }
        toast.promise(
          getVendasPeriodoRelatorio({
            inicio: formatToApiDate(params.inicio)!,
            fim: formatToApiDate(params.fim)!,
            formato: params.formato
          }),
          {
            loading: "Gerando relatório...",
            success: "Relatório gerado!",
            error: "Erro ao gerar relatório"
          }
        );
      } else if (selectedReport === "mensal") {
        if (!params.mes || !params.ano) {
          toast.error("Mês e ano são obrigatórios");
          return;
        }
        toast.promise(
          getVendasMensalRelatorio({
            mes: params.mes.padStart(2, "0"),
            ano: params.ano,
            formato: params.formato
          }),
          {
            loading: "Gerando relatório...",
            success: "Relatório gerado!",
            error: "Erro ao gerar relatório"
          }
        );
      } else if (selectedReport === "desempenho") {
        await refetchDesempenho();
        toast.success("Dados de desempenho carregados!");
      } else if (selectedReport === "fluxo") {
        setReportParams({
          inicio: formatToApiDate(params.inicio),
          fim: formatToApiDate(params.fim)
        });
        setTimeout(() => refetchFluxo(), 0);
        toast.success("Fluxo de horários carregado!");
      } else if (selectedReport === "ticket") {
        setReportParams({
          inicio: formatToApiDate(params.inicio),
          fim: formatToApiDate(params.fim)
        });
        setTimeout(() => refetchTicket(), 0);
        toast.success("Ticket médio calculado!");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro: " + message);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Estatísticas</h1>
          <p className="text-muted-foreground">Consulte dados de vendas e desempenho da equipe.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title="Vendas por Período"
            description="Detalhamento das vendas entre duas datas específicas."
            icon={Calendar}
            onClick={() => handleCardClick("periodo")}
          />
          <ReportCard
            title="Resumo Mensal de Itens"
            description="Lista consolidada de todos os produtos vendidos no mês."
            icon={BarChart3}
            onClick={() => handleCardClick("mensal")}
          />
          <ReportCard
            title="Ticket Médio"
            description="Análise do valor médio gasto por venda e faturamento total no período."
            icon={AlertCircle}
            onClick={() => handleCardClick("ticket")}
          />
          <ReportCard
            title="Horários de Pico"
            description="Identifique os horários de maior fluxo de clientes no seu estabelecimento."
            icon={FileText}
            onClick={() => handleCardClick("fluxo")}
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportCard
            title="Desempenho de Garçons"
            description="Ranking de vendas por garçom no mês vigente. Visualização em tela."
            icon={Users}
            onClick={() => handleCardClick("desempenho")}
          />
        </div> */}

        <div className="space-y-8">
          {/* Visualização de Ticket Médio */}
          {ticket && selectedReport === "ticket" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-80">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">R$ {ticket.ticket_medio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-80">Total Faturado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">R$ {ticket.total_faturado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-80">Total de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{ticket.total_vendas}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Visualização de Fluxo Horário */}
          {fluxo && selectedReport === "fluxo" && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-blue-600" />
                  Fluxo de Vendas por Horário
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fluxo}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(label) => `${label}:00h`}
                    />
                    <Bar dataKey="vendas" radius={[4, 4, 0, 0]}>
                      {fluxo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.vendas === Math.max(...fluxo.map(f => f.vendas)) ? '#2563eb' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Visualização de Desempenho */}
          {desempenho && desempenho.length > 0 && selectedReport === "desempenho" && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-blue-600" />
                  Desempenho de Garçons - Mês Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Garçom</TableHead>
                      <TableHead className="text-right">Total Vendido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenho.map((item) => (
                      <TableRow key={item.id_garcom}>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">
                          R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty States */}
        {selectedReport === "desempenho" && desempenho?.length === 0 && !isLoadingDesempenho && (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-lg border border-dashed text-slate-500">
            <AlertCircle size={48} className="mb-4" />
            <p>Nenhum dado de desempenho encontrado para o mês atual.</p>
          </div>
        )}

        <ReportParamDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          reportType={selectedReport}
          onConfirm={handleGenerateReport}
        />
      </div>
    </DefaultLayout>
  );
}
