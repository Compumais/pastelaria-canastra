"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CASH_CLOSE_TOTAL, CASH_OPEN_TOTAL, CURRENT_USER, IS_CASH_OPEN } from "@/storage/storage-config";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postCashClose } from "@/api/post-close-cash";
import { getPrinters } from "@/api/get-printers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const cashCloseSchema = z.object({
  currentCash: z.number(),
  observations: z.string().optional(),
})

type CashCloseSchema = z.infer<typeof cashCloseSchema>;

interface CashRegisterClosingDialogProps {
  isOpen: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}

export function CashRegisterClosingDialog({
  isOpen,
  onClose
}: CashRegisterClosingDialogProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [currentUser, setCurrentUser] = useState("")
  const [cashOpenTotal, setCashOpenTotal] = useState(0)
  const [cashCloseTotal, setCashCloseTotal] = useState(0)
  const [selectedPrinter, setSelectedPrinter] = useState("")

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CashCloseSchema>({
    resolver: async (data) => {
      const result = cashCloseSchema.safeParse(data);
      if (result.success) return { values: result.data, errors: {} };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { values: {}, errors: result.error.flatten() as unknown as any };
    }
  })

  const handleCloseCash = async (data: CashCloseSchema) => {
    try {
      await cashCloseFn({
        user: currentUser,
        observation: data.observations,
        cashCloseTotal: cashCloseTotal.toString(),
        cashOpenTotal: cashOpenTotal.toString(),
        cashCloseTotalCurrent: data.currentCash.toString(),
        printer: selectedPrinter.toString(),
      })

      localStorage.setItem(IS_CASH_OPEN, "false")
      reset()
      setCurrentUser("")
      setCashOpenTotal(0)
      setCashCloseTotal(0)
      setSelectedPrinter("")
      logout()
      onClose(false);

      router.push("/login")

      toast.success("Caixa fechado com sucesso", {
        position: "top-center"
      })
    } catch {
      toast.error("Falha ao fechar caixa", {
        position: "top-center"
      })
    }
  }

  const { mutateAsync: cashCloseFn } = useMutation({
    mutationFn: postCashClose
  })

  const { data: printers } = useQuery({
    queryKey: ["printers"],
    queryFn: getPrinters
  })

  useEffect(() => {
    if (!isOpen) return

    const currentUserStored = localStorage.getItem(CURRENT_USER)
    const cashOpenTotalStored = localStorage.getItem(CASH_OPEN_TOTAL)
    const cashCloseTotalStored = localStorage.getItem(CASH_CLOSE_TOTAL)

    if (currentUserStored) setCurrentUser(currentUserStored)
    if (Number(cashOpenTotalStored)) setCashOpenTotal(Number(cashOpenTotalStored))
    if (Number(cashCloseTotalStored)) setCashCloseTotal(Number(cashCloseTotalStored))
  }, [isOpen])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Fechar Caixa</DialogTitle>
        <DialogDescription>Informe os detalhes para o fechamento de caixa</DialogDescription>

        <form onSubmit={handleSubmit(handleCloseCash)} className="flex flex-col gap-3 mt-5">
          <div className="space-y-2">
            <Label htmlFor="currentUser">Fechado por</Label>
            <Input id="currentUser" className="border-blue-500" value={currentUser} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cashOpenTotal">Total na Abertura</Label>
            <Input id="cashOpenTotal" className="border-blue-500" value={cashOpenTotal} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cashCloseTotal">Total</Label>
            <Input id="cashCloseTotal" className="border-blue-500" value={cashCloseTotal} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCash">No Caixa</Label>
            <Controller
              control={control}
              name="currentCash"
              render={({ field: { onChange, value } }) => (
                <Input
                  inputMode="numeric"
                  value={
                    isNaN(value)
                      ? ""
                      : value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                  }
                  onChange={(e) => {
                    const numericValue = Number(
                      e.target.value.replace(/\D/g, "")
                    );
                    onChange(numericValue / 100);
                  }}
                  className="border-blue-500"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              className="border-blue-500 resize-none"
              {...register("observations")}
            />
          </div>

          <div className="space-y-2">
            <Label>Impressora</Label>
            <Select onValueChange={setSelectedPrinter}>
              <SelectTrigger className="border-blue-500">
                <SelectValue placeholder="Selecione a impressora" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {printers?.map((printer) => (
                  <SelectItem key={printer.id} value={printer.ip.toString()}>
                    {printer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button disabled={isSubmitting} type="submit" className="mt-3">
            Fechar
          </Button>
        </form>
      </DialogHeader>
    </DialogContent>
  )
}