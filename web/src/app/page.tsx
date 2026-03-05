"use client";

import { useQuery } from "@tanstack/react-query";
import { Link as IconLink, Utensils } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getOpenOrders } from "@/api/get-open-orders";
import { Header } from "@/components/header";
import { OpenOrdersButtonSkeleton } from "@/components/open-orders-button-skeleton";
import { OrdersDetail } from "@/components/orders-detail";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CashRegisterClosingDialog } from "@/components/cash-register-closing-dialog";
import { useAuth } from "@/context/auth-context";
import { CashOpenDialog } from "@/components/cash-open-dialog";
import { IS_CASH_OPEN } from "@/storage/storage-config";

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [orderId, setOrderId] = useState<number>()
  const [isOpen, setIsOpen] = useState(false)
  const [isCashCloseDialogOpen, setIsCashCloseDialogOpen] = useState(false)
  const [forceCashDialogOpen, setForceCashDialogOpen] = useState(false)

  const { data, isLoading: ordersLoading } = useQuery({
    queryKey: ["open-orders"],
    queryFn: getOpenOrders,
    refetchInterval: 1000 * 60 * 1 // 1 minute
  })

  const handleCloseDetails = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const stored = localStorage.getItem(IS_CASH_OPEN)
    if (stored === "true") {
      setForceCashDialogOpen(true)
    } else {
      setForceCashDialogOpen(false)
    }
  }, [])

  return (
    <div className="max-w-screen min-h-screen w-full h-full bg-gray-300 text-gray-900">
      <Header />

      <main className="flex flex-col p-10 space-y-5">
        <div className="w-full flex items-center justify-between">
          <PageTitle title="Fechar Comanda" />

          <Button variant="default" asChild className="max-sm:hidden">
            {isAuthenticated ? (
              <Link href="/comandas" className="flex items-center gap-2">
                <IconLink size={16} />
                Ir para Comandas
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2">
              <IconLink size={16} />
              Ir para Login
            </Link>
            )}
          </Button>
        </div>

        <div className="w-full bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Utensils size={16} />
            Ativas
          </h3>
          <div className="flex flex-wrap items-center justify-baseline gap-2">
            {ordersLoading && <OpenOrdersButtonSkeleton />}

            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              {data && data
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <DialogTrigger key={item.id} asChild>
                    <Button
                      value={item.numeromesa}
                      onClick={() => { setOrderId(Number(item.numeromesa)); setIsOpen(true) }}
                      className="cursor-pointer"
                      disabled={!isAuthenticated}
                    >
                      {item.numeromesa}
                    </Button>
                  </DialogTrigger>
                ))}
            </Dialog>

            {data === null && ordersLoading === false && (
              <h1 className="text-xl font-bold">Ops, nenhuma comanda ativa! 😢</h1>
            )}
          </div>
        </div>

        <div className="flex flex-1 bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="space-y-2">
              <Label htmlFor="order-number" className="font-medium text-gray-700">
                Número da Comanda
              </Label>

              <Input
                placeholder="Ex: 1166"
                type="number"
                min={0}
                className="bg-gray-100 focus:ring-2 focus:ring-blue-500"
                defaultValue={orderId}
                onChange={(e) => {
                  const value = e.target.value;
                  setOrderId(value ? Number(value) : undefined);
                }}
              />
            </div>

            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  disabled={!orderId || data === null || !isAuthenticated}
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Finalizar
                </Button>
              </DialogTrigger>

              {orderId && (
                <OrdersDetail
                  onClose={handleCloseDetails}
                  orderId={orderId}
                  open={isOpen}
                  setOrderId={setOrderId}
                />
              )
              }
            </Dialog>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto w-full">
          <Dialog open={isCashCloseDialogOpen} onOpenChange={setIsCashCloseDialogOpen}>
            <DialogTrigger asChild className="w-full">
              <Button
                disabled={!isAuthenticated}
                className="w-full"
              >
                Fechar Caixa
              </Button>
            </DialogTrigger>

            <CashRegisterClosingDialog isOpen={isCashCloseDialogOpen} onClose={setIsCashCloseDialogOpen} />
          </Dialog>
        </div>
      </main>

      {isAuthenticated && (
        <Dialog open={!forceCashDialogOpen}>
          <CashOpenDialog onClose={setForceCashDialogOpen} />
        </Dialog>
      )}
    </div>
  );
}
