import { Loader2 } from "lucide-react";
import { DefaultLayout } from "./default-layout";

export function LoadingPage() {
  return (
    <DefaultLayout>
      <div className="h-[calc(100vh_-_6rem)] w-full flex flex-col justify-center items-center bg-gray-300">
        <span>
          <Loader2 size={48} className="animate-spin text-blue-500" />
        </span>
      </div>
    </DefaultLayout>
  )
}