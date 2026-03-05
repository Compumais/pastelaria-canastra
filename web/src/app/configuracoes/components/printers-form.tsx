"use client";

import { postRegisterPrinter } from "@/api/post-register-printer";
import { postTestPrinter } from "@/api/post-test-printer";
import { putEditPrinter } from "@/api/put-edit-printer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/context/auth-context";
import { type GetPrintersResponse } from "@/api/get-printers";

const printersFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  ip: z.string().min(1, "IP é obrigatório"),
  port: z.string().min(1, "Porta é obrigatória"),
})

type PrintersFormSchema = z.infer<typeof printersFormSchema>

interface PrintersFormProps {
  editingPrinter?: GetPrintersResponse | null;
  onCancelEdit: () => void;
}

export function PrintersForm({ editingPrinter, onCancelEdit }: PrintersFormProps) {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<PrintersFormSchema>({
    resolver: async (data) => {
      const result = printersFormSchema.safeParse(data);
      if (result.success) return { values: result.data, errors: {} };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { values: {}, errors: result.error.flatten() as unknown as any };
    },
    defaultValues: {
      name: "",
      ip: "",
      port: "9100",
    }
  })

  useEffect(() => {
    if (editingPrinter) {
      setValue("name", editingPrinter.name);
      setValue("ip", editingPrinter.ip);
      setValue("port", editingPrinter.port);
    } else {
      reset({
        name: "",
        ip: "",
        port: "9100"
      });
    }
  }, [editingPrinter, setValue, reset]);

  const formData = watch();

  const saveMutation = useMutation({
    mutationFn: async (data: PrintersFormSchema) => {
      if (editingPrinter) {
        await putEditPrinter({
          id: editingPrinter.id,
          name: data.name,
          ip: data.ip,
          port: data.port
        });
      } else {
        await postRegisterPrinter({
          name: data.name,
          ip: data.ip,
          port: data.port
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
      toast.success(editingPrinter ? "Impressora atualizada!" : "Impressora cadastrada!");
      onCancelEdit();
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao salvar: " + message);
    }
  });

  const testMutation = useMutation({
    mutationFn: postTestPrinter,
    onSuccess: () => {
      toast.success("Teste de impressão enviado!");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Falha no teste: " + message);
    }
  });

  const handleSaveConfigs = async (data: PrintersFormSchema) => {
    saveMutation.mutate(data);
  }

  const handleTestPrinter = () => {
    if (!formData.ip) {
      toast.error("Informe o IP para testar");
      return;
    }
    testMutation.mutate({
      ip: formData.ip,
      port: formData.port
    });
  }

  return (
    <form
      className="mt-6 p-6 w-full h-full bg-slate-200 shadow-md rounded-lg grid grid-cols-3 gap-4 border border-slate-300"
      onSubmit={handleSubmit(handleSaveConfigs)}
    >
      <div className="col-span-3 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Printer className="text-blue-600" />
          {editingPrinter ? "Editar Impressora" : "Configurar Impressora"}
        </h2>
        {editingPrinter && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
            className="text-gray-600 border-gray-400 hover:bg-gray-300"
          >
            Cancelar Edição
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome da Impressora</Label>
        <Input
          id="name"
          disabled={!isAdmin}
          className="bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          placeholder="Ex: Cozinha, Bar, Cupom"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ip">IP da Impressora</Label>
        <Input
          id="ip"
          disabled={!isAdmin}
          className="bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          placeholder="Ex: 192.168.1.100"
          {...register("ip")}
        />
        {errors.ip && <p className="text-red-500 text-xs">{errors.ip.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="port">Porta</Label>
        <Input
          id="port"
          type="number"
          disabled={!isAdmin}
          className="bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          placeholder="9100"
          {...register("port")}
        />
        {errors.port && <p className="text-red-500 text-xs">{errors.port.message}</p>}
      </div>

      <div className="col-span-3">
        <div className="flex justify-end gap-4 mt-2">
          <Button
            type="button"
            disabled={testMutation.isPending || !isAdmin}
            onClick={handleTestPrinter}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMutation.isPending ? "Testando..." : "Testar Impressora"}
          </Button>

          <Button
            disabled={isSubmitting || !isAdmin}
            type="submit"
            className="cursor-pointer bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Salvando..." : editingPrinter ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  )
}
