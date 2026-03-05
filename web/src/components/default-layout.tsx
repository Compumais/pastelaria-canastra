import type { ReactNode } from "react";
import { Header } from "./header";

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="max-w-screen min-h-screen w-full h-full bg-gray-300 text-gray-900">
      <Header />

      { children }
    </div>
  )
}