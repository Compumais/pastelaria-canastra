import { Suspense } from "react";
import OrdersList from "./order-list";
import { LoadingPage } from "@/components/loading-page";

export default function OrdersPage() {
  return (
    <div className="max-w-screen min-h-screen w-full h-full bg-gray-300 text-gray-900">
      <Suspense fallback={
        <LoadingPage />
      }>
        <OrdersList />
      </Suspense>
    </div>
  );
}