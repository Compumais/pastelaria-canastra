/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { DefaultLayout } from "@/components/default-layout";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeClosed, Link as IconLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { postLogin } from "@/api/post-login";
import { z } from "zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { logged } = useAuth();
  const router = useRouter()

  const [inputTypeText, setInpuTypeText] = useState<"password" | "text">("password")

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginSchema>()

  const handleSignIn = async (data: LoginSchema) => {
    try {
      const { user } = await loginFn({
        username: data.username,
        password: data.password,
      })

      logged(user.adm, user.nome);

      if (user.adm === 1) {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    } catch (error) {
      toast.error("Credenciais inválidas", {
        position: "top-center",
      })
    }
  };

  const { mutateAsync: loginFn } = useMutation({
    mutationFn: postLogin,
  })

  return (
    <DefaultLayout>
      <div className="flex flex-col p-10 space-y-5">
        <div className="w-full flex items-center justify-between">
          <PageTitle title="Entre com suas credenciais" />

          <Button variant="default" asChild className="max-sm:hidden">
            <Link href="/" className="flex items-center gap-2">
              <IconLink size={16} />
              Ir para Comandas
            </Link>
          </Button>
        </div>

        <div className="flex flex-1 bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto w-full">
          <form
            onSubmit={handleSubmit(handleSignIn)}
            className="flex flex-col gap-6 w-full"
          >
            <div className="space-y-2">
              <Label htmlFor="username" className="font-medium text-gray-700">
                E-mail
              </Label>

              <Input
                id="username"
                placeholder="João S"
                className="bg-gray-100 focus:ring-2 focus:ring-blue-500"
                {...register("username")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Senha
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  placeholder="Sua senha"
                  className="bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  type={inputTypeText}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setInpuTypeText(prev => prev === "password" ? "text" : "password")}
                  className="absolute bottom-2 right-3 cursor-pointer"
                >
                  {inputTypeText === "password" ? <EyeClosed size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-5 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  )
}