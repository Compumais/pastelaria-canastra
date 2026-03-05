"use client";

import { CASH_CLOSE_TOTAL, CASH_OPEN_TOTAL, IS_CASH_OPEN } from "@/storage/storage-config";
import { createContext, useContext, useEffect, useState } from "react";

type CashCloseContextType = {
  onCashOpened: (currentCash: number) => void;
  onCashCloseSum: (amount: number) => void
  onCashClosed: () => void;
  cashCloseTotal: number
  isCashOpen: boolean | undefined
};

const CashCloseContext = createContext<CashCloseContextType | undefined>(undefined);

export function CashCloseProvider({ children }: { children: React.ReactNode }) {
  const [cashCloseTotal, setCasCloseTotal] = useState(0)
  const [isCashOpen, setIsCashOpen] = useState<boolean | undefined>(undefined)

  const onCashOpened = (currentCash: number) => {
    setIsCashOpen(true)
    localStorage.setItem(IS_CASH_OPEN, "true")
    localStorage.setItem(CASH_OPEN_TOTAL, currentCash.toString())
  }

  const onCashCloseSum = (amount: number) => {
    const current = localStorage.getItem(CASH_CLOSE_TOTAL);

    const currentNumber = Number(current) || 0;

    const newTotal = currentNumber + amount;

    setCasCloseTotal(newTotal);
    localStorage.setItem(CASH_CLOSE_TOTAL, newTotal.toString());
  };

  const onCashClosed = () => {
    setCasCloseTotal(0)
    localStorage.removeItem(CASH_CLOSE_TOTAL)
    localStorage.removeItem(IS_CASH_OPEN)
  }

  useEffect(() => {
    const isCashOpenInStorage = localStorage.getItem(IS_CASH_OPEN)

    if (isCashOpenInStorage === "true") {
      setIsCashOpen(false)
    } else if (isCashOpenInStorage === "false") {
      setIsCashOpen(true)
    }
  }, [])

  return (
    <CashCloseContext.Provider value={{
      isCashOpen,
      cashCloseTotal,
      onCashOpened,
      onCashClosed,
      onCashCloseSum,
    }}>
      {children}
    </CashCloseContext.Provider>
  );
}

export function useCashClose() {
  const context = useContext(CashCloseContext);
  if (!context) {
    throw new Error("useCashClose precisa estar dentro de <CashCloseProvider>");
  }
  return context;
}
