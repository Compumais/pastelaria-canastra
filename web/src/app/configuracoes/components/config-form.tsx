"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_URL, PDV, PORT } from "@/storage/storage-config";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";
import { useEffect } from "react";


const configSchema = z.object({
  baseUrl: z.string(),
  port: z.string(),
  pdv: z.string(),
})

type ConfigSchema = z.infer<typeof configSchema>

export function ConfigForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ConfigSchema>({
    resolver: async (data) => {
      const result = configSchema.safeParse(data);
      if (result.success) return { values: result.data, errors: {} };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { values: {}, errors: result.error.flatten() as unknown as any };
    },
    defaultValues: {
      baseUrl: "",
      port: "",
      pdv: "",
    }
  })

  useEffect(() => {
    reset({
      baseUrl: localStorage.getItem(BASE_URL) || "",
      port: localStorage.getItem(PORT) || "",
      pdv: localStorage.getItem(PDV) || "",
    })
  }, [reset])


  const handleSaveConfigs = async (data: ConfigSchema) => {
    try {
      if (!data.baseUrl.trim() || !data.port.trim() || !data.pdv.trim()) {
        toast.error("IP, porta e PDV são obrigatórios", {
          position: "top-center",
          duration: 3000,
        })
        return;
      }

      localStorage.setItem(BASE_URL, data.baseUrl);
      localStorage.setItem(PORT, data.port);
      localStorage.setItem(PDV, data.pdv);

      toast.success("Configurações salvas com sucesso", {
        position: "top-center",
        duration: 3000,
      })
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar configurações", {
        position: "top-center",
        duration: 3000,
      })
    }
  }

  return (
    <form
      className="mt-6 p-6 w-full h-full bg-slate-200 shadow-md rounded-lg grid grid-cols-3 gap-4 border border-slate-300"
      onSubmit={handleSubmit(handleSaveConfigs)}
    >
      <div className="col-span-3 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Server className="text-blue-600" />
          Configurações do Servidor
        </h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="baseUrl">IP do Servidor</Label>
        <Input
          id="baseUrl"
          className="bg-gray-300 focus:ring-2 focus:ring-blue-500"
          placeholder="192.168.2.33"
          {...register("baseUrl")}
        />
        {errors.baseUrl && <p className="text-red-500">{errors.baseUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="baseUrl">Porta do Servidor</Label>
        <Input
          id="port"
          type="number"
          max={65535}
          min={1}
          className="bg-gray-300 focus:ring-2 focus:ring-blue-500"
          placeholder="5000"
          {...register("port")}
        />
        {errors.port && <p className="text-red-500">{errors.port.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pdv">PDV</Label>
        <Input
          id="pdv"
          className="bg-gray-300 focus:ring-2 focus:ring-blue-500"
          placeholder="PDV 1"
          {...register("pdv")}
        />
        {errors.pdv && <p className="text-red-500">{errors.pdv.message}</p>}
      </div>

      <div className="col-span-3">
        <div className="flex justify-end gap-4">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </Button>
        </div>
      </div>
    </form>
  )
}