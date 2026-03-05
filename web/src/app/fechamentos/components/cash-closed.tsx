'use client';

import {
  Table, TableBody, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { CashClosedTableRow } from "./cash-closed-table-row";
import { Pagination } from "@/components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getCloseCashes } from "@/api/get-close-cashes";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { PageTitle } from "@/components/page-title";

export default function CashClosedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data } = useQuery({
    queryKey: ["closed-cashes", pageIndex],
    queryFn: () => getCloseCashes({ pageIndex }),
  });

  const handlePaginate = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (pageIndex + 1).toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col p-10 space-y-5">
      <div className="w-full flex items-center justify-between">
        <PageTitle title="Lista de fechamentos de caixa" />
      </div>
      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Total</TableHead>
              <TableHead>No caixa</TableHead>
              <TableHead>Abertura</TableHead>
              <TableHead>Diferença</TableHead>
              <TableHead>Funcionario</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.fechamentos.map((closed) => (
              <CashClosedTableRow
                key={closed.id}
                data={closed}
              />
            ))}
          </TableBody>
        </Table>

        {data && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={pageIndex}
            perPage={data.per_page}
            totalCount={data.total_count}
          />
        )}
      </div>
    </div>
  );
}
