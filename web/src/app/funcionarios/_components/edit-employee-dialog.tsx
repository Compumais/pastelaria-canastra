/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putEditUser } from "@/api/put-edit-user";
import { toast } from "sonner";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const editEmployeeSchema = z.object({
  username: z.string(),
  password: z.string(),
})

type EditEmployeeSchema = z.infer<typeof editEmployeeSchema>

interface EditEmployeeDialogProps {
  employeeId: number
  data: EditEmployeeSchema
}

export function EditEmployeeDialog({ employeeId, data }: EditEmployeeDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditEmployeeSchema>({
    defaultValues: {
      username: data.username,
      password: data.password,
    }
  })

  const handleEditEmployee = async (data: EditEmployeeSchema) => {
    try {
      if (data.username === "" || data.password === "") {
        throw new Error()
      }

      await editEmployee({
        body: data,
        params: {
          id: employeeId,
        }
      })

      toast.success(`Usuário ${data.username.split(" ")[0]} cadastrado com sucesso`, {
        position: "top-center",
        action: "Voltar"
      })

      reset()
    } catch {
      toast.error("Não foi possível editar usuário", {
        position: "top-center",
        action: "Voltar"
      })
    }
  }

  const { mutateAsync: editEmployee } = useMutation({
    mutationFn: putEditUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['users']})
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar funcionário</DialogTitle>
        <DialogDescription>
          Edite as informações do funcionário que vai utilizar a plataforma
        </DialogDescription>

        <form onSubmit={handleSubmit(handleEditEmployee)} className="mt-10 flex flex-col gap-2">
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
            Editar
          </Button>
        </form>
      </DialogHeader>
    </DialogContent>
  );
}
