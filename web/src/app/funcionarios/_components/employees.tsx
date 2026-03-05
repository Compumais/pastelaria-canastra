"use client"

import { PageTitle } from "@/components/page-title"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Link as IconLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/get-users";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { EmployeesTableRowSkeleton } from "./employees-table-row-skeleton";
import { EmplyeesTableRow } from "./employees-table-row";
import { DefaultLayout } from "@/components/default-layout";
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterUserDialog } from "./register-employee-dialog";

export function Employees() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1")

  const { data, isLoading } = useQuery({
    queryKey: ["users", pageIndex],
    queryFn: () => getUsers({
      pageIndex,
    })
  })

  const handlePaginate = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (pageIndex + 1).toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <DefaultLayout>
      <div className="bg-gray-300 w-full h-[calc(100vh_-_6rem)]">
        <div className="flex flex-col p-10 space-y-5">
          <div className="w-full flex items-center justify-between">
            <PageTitle title="Funcionários" />

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <IconLink size={16} />
                  Cadastrar Funcionario
                </Button>
              </DialogTrigger>

              <RegisterUserDialog />
            </Dialog>
          </div>

          <div className="mt-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[500px]">Nome</TableHead>
                  <TableHead className="w-[150px]">Senha</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <EmployeesTableRowSkeleton />}
                {data && data.usuarios.map((user) => (
                  <EmplyeesTableRow
                    id={user.id}
                    key={user.id}
                    name={user.nome}
                    password={user.senha}
                  />
                ))}
              </TableBody>
            </Table>

            {data && (
              <Pagination
                onPageChange={handlePaginate}
                pageIndex={pageIndex}
                perPage={data.per_page}
                totalCount={data.total_usuarios}
              />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}