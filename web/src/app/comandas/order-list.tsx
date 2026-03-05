'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { getCloseOrders } from "@/api/get-close-orders";
import { Header } from "@/components/header";
import { OrdersFIlter } from "@/components/orders-filters";
import { OrdersTable } from "@/components/orders-table";
import { OrdersTableSkeleton } from "@/components/orders-table-skeleton";
import { PageTitle } from "@/components/page-title";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function OrdersList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("id")
    ? z.coerce.number().parse(searchParams.get("id"))
    : undefined;

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1")

  const { data, isLoading } = useQuery({
    queryKey: ["orders", orderId, pageIndex],
    queryFn: () => getCloseOrders({
      pageIndex,
      orderId,
    }),
  });

  const handlePaginate = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (pageIndex + 1).toString());

    router.push(`?${params.toString()}`);
  };

  const hasNoOrders = !isLoading && data && data.vendas.length === 0;

  return (
    <>
      <Header />
      <main className="w-full p-10">
        <div className="w-full flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2">
          <PageTitle title="Comandas" />
          <Suspense fallback={<div>Carregando filtro...</div>}>
            <OrdersFIlter />
          </Suspense>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comanda</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Finalizado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <OrdersTableSkeleton />
              </TableBody>
            </Table>
          ) : hasNoOrders ? (
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-lg text-muted-foreground text-center">
                Nenhuma comanda finalizada.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comanda</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Finalizado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.vendas.map((order) => (
                    <OrdersTable key={order.id} order={order} />
                  ))}
                </TableBody>
              </Table>

              {data && (
                <Pagination
                  pageIndex={pageIndex}
                  perPage={data.per_page}
                  totalCount={data.total_count}
                  onPageChange={handlePaginate}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
