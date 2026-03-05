// components/orders-filters-client.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const filterSchema = z.object({
  orderId: z.coerce.number().nullable().optional()
});

type FilterSchema = z.infer<typeof filterSchema>;

export function OrdersFIlter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const orderId = searchParams.get("id");

  const {
    reset,
    register,
    handleSubmit,
  } = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      orderId: Number(orderId) && Number(orderId) > 0 ? Number(orderId) : null
    }
  });

  const handleFilter = ({ orderId }: FilterSchema) => {
    if (orderId && orderId > 0) {
      params.set("id", orderId.toString());
      params.set("page", "1")
    } else {
      params.delete("id");
    }
    router.push(`?${params.toString()}`);
  };

  const handleClearFilter = () => {
    params.delete("id");
    params.delete("page");

    reset({ orderId: null });

    router.push(`?${params.toString()}`);
  };

  return (
    <form
      className="flex items-center gap-4 max-sm:flex-col max-sm:w-full"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="text-gray-700 max-sm:hidden">Filtros</span>

      <Input
        className="bg-gray-100 w-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none max-sm:w-full"
        placeholder="Numero da comanda"
        type="number"
        {...register("orderId")}
      />

      <Button type="submit" className="cursor-pointer max-sm:w-full">
        Procurar
      </Button>

      <Button type="button" onClick={handleClearFilter} className="cursor-pointer max-sm:w-full">
        Limpar
      </Button>
    </form>
  );
}
