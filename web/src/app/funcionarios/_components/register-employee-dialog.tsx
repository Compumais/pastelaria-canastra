/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRegisterUser } from "@/api/post-register-user";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const registerUserSchema = z.object({
  username: z.string(),
  password: z.string(),
})

type RegisterUserSchema = z.infer<typeof registerUserSchema>

export function RegisterUserDialog() {
  const queryClient = useQueryClient()

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterUserSchema>()

  const handleRegisterUser = async (data: RegisterUserSchema) => {
    try {
      if (data.username === "" || data.password === "") {
        throw new Error()
      }

      await registerUser(data)

      toast.success(`Usuário ${data.username.split(" ")[0]} cadastrado com sucesso`, {
        position: "top-center",
        action: "Voltar"
      })

      reset()
    } catch {
      toast.error("Não foi possível cadastrar usuário", {
        position: "top-center",
        action: "Voltar"
      })
    }
  }

  const { mutateAsync: registerUser } = useMutation({
    mutationFn: postRegisterUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['users']})
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar funcionário</DialogTitle>
        <DialogDescription>
          Preencha as informações do funcionário que vai utilizar a plataforma
        </DialogDescription>

        <form onSubmit={handleSubmit(handleRegisterUser)} className="mt-10 flex flex-col gap-2">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              placeholder="João S"
              {...register("username")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              placeholder="canastra@joao"
              {...register("password")}
            />
          </div>

          <Button disabled={isSubmitting} type="submit" className="mt-2">
            Cadastrar
          </Button>
        </form>
      </DialogHeader>
    </DialogContent>
  );
}
