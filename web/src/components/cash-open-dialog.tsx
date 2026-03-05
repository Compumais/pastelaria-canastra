"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm, Controller } from "react-hook-form";
import { useCashClose } from "@/context/cash-close-context";
import type { Dispatch, SetStateAction } from "react";

const cashOpenedSchema = z.object({
  currentCash: z
    .number()
    .min(0.01, "Informe um valor maior que zero"),
});

type CashOpenedSchema = z.infer<typeof cashOpenedSchema>;

interface CashOpenDialogProps {
  onClose: Dispatch<SetStateAction<boolean>>;
}

export function CashOpenDialog({ onClose }: CashOpenDialogProps) {
  const { onCashOpened } = useCashClose();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CashOpenedSchema>({
    resolver: zodResolver(cashOpenedSchema),
    defaultValues: {
      currentCash: 0,
    },
  });

  const handleCashOpened = (data: CashOpenedSchema) => {
    onCashOpened(data.currentCash);
    onClose(true);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Abrir o caixa</DialogTitle>
        <DialogDescription>
          Informe quantidade em R$ que vai abrir o caixa
        </DialogDescription>

        <form
          onSubmit={handleSubmit(handleCashOpened)}
          className="flex flex-col gap-3 mt-5"
        >
          <div className="space-y-2">
            <Label>Quantidade no caixa</Label>
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
            {errors.currentCash && (
              <span className="text-sm text-red-500">
                {errors.currentCash.message}
              </span>
            )}
          </div>

          <Button disabled={isSubmitting} type="submit" className="mt-3">
            Abrir
          </Button>
        </form>
      </DialogHeader>
    </DialogContent>
  );
}
