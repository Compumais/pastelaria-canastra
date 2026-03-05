import { Suspense } from "react";
import { Employees } from "./_components/employees";
import { LoadingPage } from "@/components/loading-page";


export default function Page() {


  return (
    <Suspense fallback={
      <LoadingPage />
    }>
      <Employees />
    </Suspense>
  )
}