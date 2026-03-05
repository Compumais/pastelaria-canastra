"use client"

import { useQuery } from "@tanstack/react-query";
import { Calendar, ChartBar, Link as IconLink } from "lucide-react";
import Link from "next/link";

import { getCloseOrders } from "@/api/get-close-orders";
import { getDayRevenue } from "@/api/get-day-revenue";
import { getTotalRevenueOnMonth } from "@/api/get-total-revenue-on-month";
import { getTotalRevenueOnSixMonths } from "@/api/get-total-revenue-on-siex-months";
import { getWaiterTotalOnMonth } from "@/api/get-waiter-total-on-month";
import { getFluxoHorario } from "@/api/get-fluxo-horario";
import { getTicketMedio } from "@/api/get-ticket-medio";
import { getTopProdutos } from "@/api/get-top-produtos";
import { Header } from "@/components/header";
import { LastFiveOrdersTable } from "@/components/last-five-orders-table";
import { LastFiveOrdersTableSkeleton } from "@/components/last-five-orders-table-skeleton";
import { LastMonthRevenueChart } from "@/components/last-month-revenue-chart";
import { LastSixMonthsRevenueChart } from "@/components/last-six-months-revenue-chart";
import { PeakHourChart } from "@/components/peak-hour-chart";
import { TopItemsChart } from "@/components/top-items-chart";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WaiterTotalOnMonthChart } from "@/components/waiter-total-on-month-chart";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useMemo } from "react";

export default function Dashboard() {
  // Total ganho hoje
  const {
    data: totalDayRevenue,
  } = useQuery({
    queryKey: ["total-day-revenue"],
    queryFn: getDayRevenue,
    refetchInterval: 1000 * 60 * 10 // 10 minutes
  })

  // Últimos 5 pedidos
  const { data: orders } = useQuery({
    queryKey: ["last-five-orders"],
    queryFn: () => getCloseOrders({
      orderId: null,
      pageIndex: 0,
    }),
  })

  // Total ganho no mês
  const { data: totalRevenueMonth } = useQuery({
    queryKey: ["total-revenue-month"],
    queryFn: getTotalRevenueOnMonth,
  })

  // Total ganho nos últimos 6 meses
  const { data: totalOnSixMonths } = useQuery({
    queryKey: ["total-on-six-months"],
    queryFn: getTotalRevenueOnSixMonths,
  })

  // Faturamento por garçom
  const { data: waiterTotalOnMonth } = useQuery({
    queryKey: ["waiter-total-on-month"],
    queryFn: getWaiterTotalOnMonth,
  })

  // Ticket médio do mês
  const monthParams = useMemo(() => {
    const now = new Date();
    return {
      inicio: format(startOfMonth(now), "dd-MM-yyyy"),
      fim: format(endOfMonth(now), "dd-MM-yyyy"),
    };
  }, []);

  // Ticket médio do mês
  const { data: ticketMedioMonth } = useQuery({
    queryKey: ["ticket-medio-month", monthParams],
    queryFn: () => getTicketMedio(monthParams),
  });

  // Fluxo de horário do mês
  const { data: fluxoHorarioMonth } = useQuery({
    queryKey: ["fluxo-horario-month", monthParams],
    queryFn: () => getFluxoHorario(monthParams),
  });

  // Top produtos do mês
  const { data: topProdutosMonth } = useQuery({
    queryKey: ["top-produtos-month", monthParams],
    queryFn: () => getTopProdutos(monthParams),
  });

  // Formatação de valores
  const formattedDayRevenue = useMemo(() => {
    if (!totalDayRevenue) return null

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalDayRevenue.total_vendas)
  }, [totalDayRevenue])

  return (
    <div className="max-w-screen min-h-screen w-full h-full bg-gray-300 text-gray-900">
      <Header />

      <main className="w-full p-10">
        <div className="w-full flex items-center justify-between">
          <PageTitle title="Dashboard" />

          <Button className="cursor-pointer max-sm:hidden" variant="default" asChild>
            <Link href="/comandas">
              <IconLink size={16} />
              Ir para Comandas
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-8 mt-12 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {/* Total Ganho Hoje */}
          <div className="col-span-1 max-lg:col-span-1 max-sm:col-span-4 bg-gray-100 p-4 flex flex-1 items-center justify-center rounded-md">
            <div className="flex flex-col items-center w-full p-4 rounded-xl gap-2">
              <h3 className="text-base sm:text-lg text-gray-600 font-medium text-center">
                Total Ganho Hoje
              </h3>

              {totalDayRevenue ? (
                <span className="text-3xl md:text-2xl sm:text-4xl font-bold text-emerald-600 text-center break-words leading-tight w-full">
                  {formattedDayRevenue}
                </span>
              ) : (
                <Skeleton className="h-10 w-32 sm:w-48 md:w-28 bg-gray-300 rounded-md" />
              )}
            </div>
          </div>

          {/* Vendas Realizadas Hoje */}
          <div className="col-span-1 max-lg:col-span-1 max-sm:col-span-4 bg-gray-100 p-4 flex flex-1 items-center justify-center rounded-md">
            <div className="flex flex-1 items-center justify-center gap-3 md:flex-col md:items-center md:justify-center">
              <span className="flex items-center gap-1 text-gray-700">
                <Calendar size={16} />
                Hoje
              </span>

              <span className="flex items-center text-blue-700 gap-1">
                <ChartBar size={16} />
                {totalDayRevenue
                  ? `${totalDayRevenue.total_fechadas} vendas realizadas`
                  : (<Skeleton className="w-32 h-4 bg-blue-500" />)
                }
              </span>
            </div>
          </div>

          {/* Ticket Médio (Mês) */}
          <div className="col-span-1 max-lg:col-span-1 max-sm:col-span-4 bg-gray-100 p-4 flex flex-1 items-center justify-center rounded-md">
            <div className="flex flex-col items-center w-full p-4 rounded-xl gap-2">
              <h3 className="text-base sm:text-lg text-gray-600 font-medium text-center">
                Ticket Médio (Mês)
              </h3>

              {ticketMedioMonth ? (
                <span className="text-3xl md:text-2xl sm:text-4xl font-bold text-emerald-600 text-center break-words leading-tight w-full">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(ticketMedioMonth.ticket_medio)}
                </span>
              ) : (
                <Skeleton className="h-10 w-32 sm:w-48 md:w-28 bg-gray-300 rounded-md" />
              )}
            </div>
          </div>

          {/* Vendas (Mês) */}
          <div className="col-span-1 max-lg:col-span-1 max-sm:col-span-4 bg-gray-100 p-4 flex flex-1 items-center justify-center rounded-md">
            <div className="flex flex-col items-center w-full p-4 rounded-xl gap-2">
              <span className="flex items-center gap-1 text-gray-700">
                <Calendar size={16} />
                Mês
              </span>

              <span className="flex items-center text-blue-700 gap-1">
                <ChartBar size={16} />
                {ticketMedioMonth
                  ? `${ticketMedioMonth.total_vendas} vendas realizadas`
                  : (<Skeleton className="w-32 h-4 bg-blue-500" />)
                }
              </span>
            </div>
          </div>

          {/* Horários de Pico (Mês) */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 bg-gray-100 p-6 max-sm:p-4 flex flex-1 items-center justify-center rounded-md w-full h-full">
            <div className="flex flex-col items-start justify-start w-full h-full">
              <h3 className="text-xl max-md:text-lg max-sm:text-base font-bold mb-1">
                Horários de Pico (Mês)
              </h3>
              <span className="text-base max-md:text-sm max-sm:text-xs font-light mb-4 text-gray-500">
                Volume de movimentação por hora do dia
              </span>

              {!fluxoHorarioMonth ? (
                <Skeleton className="h-[200px] w-full bg-gray-300 rounded-md" />
              ) : (
                <div className="w-full">
                  <PeakHourChart data={fluxoHorarioMonth} />
                </div>
              )}
            </div>
          </div>

          {/* Top 5 Itens (Mês) */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 bg-gray-100 p-6 max-sm:p-4 flex flex-1 items-center justify-center rounded-md w-full">
            <div className="flex flex-col items-start justify-start w-full min-h-[180px]">
              <h3 className="text-xl max-md:text-lg max-sm:text-base font-bold mb-1">
                Top 5 Itens (Mês)
              </h3>
              <span className="text-base max-md:text-sm max-sm:text-xs font-light mb-4 text-gray-500">
                Produtos mais consumidos por quantidade
              </span>

              {!topProdutosMonth ? (
                <Skeleton className="h-[200px] w-full bg-gray-300 rounded-md" />
              ) : (
                <div className="w-full">
                  <TopItemsChart data={topProdutosMonth} />
                </div>
              )}
            </div>
          </div>

          {/* Total no Mês */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 bg-gray-100 p-6 max-sm:p-4 flex flex-1 items-center justify-center rounded-md w-full">
            <div className="flex flex-col items-start justify-start w-full">
              <h3 className="text-xl max-md:text-lg max-sm:text-base font-bold">
                Total no mês
              </h3>

              <span className="text-base max-md:text-sm max-sm:text-xs font-light mb-4">
                Ganhos diários do mês atual
              </span>

              {totalRevenueMonth && (<LastMonthRevenueChart data={totalRevenueMonth} />)}
            </div>
          </div>

          {/* Últimos 6 Meses */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 bg-gray-100 p-6 max-sm:p-4 flex flex-1 items-center justify-center rounded-md w-full">
            <div className="flex flex-col items-start justify-start w-full">
              <h3 className="text-xl max-md:text-lg max-sm:text-base font-bold">
                Últimos 6 Meses
              </h3>

              <span className="text-base max-md:text-sm max-sm:text-xs font-light mb-4">
                Comparativo dos últimos 6 meses
              </span>

              {totalOnSixMonths && (
                <div className="w-full">
                  <LastSixMonthsRevenueChart data={totalOnSixMonths} />
                </div>
              )}
            </div>
          </div>

          {/* Faturamento por Garçom */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 bg-gray-100 p-4 flex flex-1 items-center justify-center">
            <div className="flex flex-col items-start justify-start w-full min-h-[200px]">
              <h3 className="text-xl font-bold mb-2">
                Faturamento por garçom
              </h3>

              {!waiterTotalOnMonth ? (
                <Skeleton className="h-[200px] w-full bg-gray-300 rounded-md" />
              ) : (
                <WaiterTotalOnMonthChart data={waiterTotalOnMonth} />
              )}
            </div>
          </div>

          {/* Últimos 5 Pedidos */}
          <div className="col-span-2 max-lg:col-span-2 max-sm:col-span-4 bg-gray-100 p-4 flex flex-1 items-center justify-center rounded-md min-h-[180px]">
            {!orders ? (
              <Table>
                <TableCaption>Últimos 5 pedidos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Comanda</TableHead>
                    <TableHead className="w-[100px]">Valor</TableHead>
                    <TableHead className="w-[100px]">Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <LastFiveOrdersTableSkeleton />
                </TableBody>
              </Table>
            ) : orders.vendas.length > 0 ? (
              <Table>
                <TableCaption>Últimos 5 pedidos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-sm">Comanda</TableHead>
                    <TableHead className="w-[150px] text-sm">Valor</TableHead>
                    <TableHead className="w-[100px] text-sm">Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <LastFiveOrdersTable orders={orders} />
                </TableBody>
              </Table>
            ) : (
              // Sem pedidos: mostra mensagem centralizada
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-xl text-muted-foreground max-md:text-sm">
                  Nenhuma comanda finalizada. ☹
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
