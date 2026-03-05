import { MoveLeft } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-300">
      <Header />
      
      <div className="flex flex-1 flex-col justify-center items-center">
        <h1 className="text-xl mb-4">
          404 - Página não encontrada
        </h1>

        <Button variant="link" asChild>
          <Link className="flex items-center gap-1" href="/login">
            <MoveLeft  size={24} />
            Voltar
          </Link>
        </Button>
      </div>
    </div>
  )
}