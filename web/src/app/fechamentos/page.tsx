import { DefaultLayout } from "@/components/default-layout";
import CashClosedClient from "./components/cash-closed";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <DefaultLayout>
      <div className="bg-gray-300 w-full">
        <Suspense fallback={
          <div className="h-[calc(100vh_-_6rem)] w-full flex flex-col justify-center items-center bg-gray-300">
            <span>
              <Loader2 size={48} className="animate-spin text-blue-500" />
            </span>
          </div>
        }>
          <CashClosedClient />
        </Suspense>
      </div>
    </DefaultLayout>
  );
}
