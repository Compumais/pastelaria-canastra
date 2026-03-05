"use client";

import { deletePrinter } from "@/api/delete-printer";
import { getPrinters, GetPrintersResponse } from "@/api/get-printers";
import { Header } from "@/components/header";
import { PageContent } from "@/components/page-content";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, LinkIcon, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { ConfigForm } from "./components/config-form";
import { PrintersForm } from "./components/printers-form";

export default function ConfiguracoesPage() {
  const [editingPrinter, setEditingPrinter] = useState<GetPrintersResponse | null>(null);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: printers = [], isLoading } = useQuery({
    queryKey: ["printers"],
    queryFn: getPrinters,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrinter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
      toast.success("Impressora removida!");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao remover: " + message);
    }
  });

  const handleEdit = (printer: GetPrintersResponse) => {
    setEditingPrinter(printer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    toast("Deseja realmente excluir esta impressora?", {
      duration: 10000,
      position: "top-center",
      action: {
        label: "Excluir",
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => { },
      },
    });
  };

  return (
    <PageContent>
      <Header />

      <main className="w-full p-10">
        <div className="w-full flex items-center justify-between">
          <PageTitle title="Configurações" />

          <Button className="cursor-pointer max-sm:hidden" variant="default" asChild>
            <Link href="/">
              <LinkIcon size={16} />
              Ir para Início
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ConfigForm />
          <PrintersForm
            editingPrinter={editingPrinter}
            onCancelEdit={() => setEditingPrinter(null)}
          />
        </div>

        <div className="mt-8 bg-slate-50 rounded-lg shadow-inner p-4 border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">Impressoras Cadastradas</h3>

          {isLoading ? (
            <p className="text-center py-4 text-slate-500">Carregando...</p>
          ) : printers.length === 0 ? (
            <p className="text-center py-4 text-slate-500 italic">Nenhuma impressora cadastrada.</p>
          ) : (
            <div className="grid gap-3">
              {printers.map((printer) => (
                <div
                  key={printer.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-md hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Printer size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{printer.name}</h4>
                      <p className="text-sm text-slate-500">
                        {printer.ip}:{printer.port}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={!isAdmin}
                      className="text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                      onClick={() => handleEdit(printer)}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={!isAdmin}
                      className="text-red-600 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => handleDelete(printer.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageContent>
  );
}