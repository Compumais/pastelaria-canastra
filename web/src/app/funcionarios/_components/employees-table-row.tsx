"use client";

import { deleteUser } from "@/api/delete-user";
import { getUser } from "@/api/get-user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditEmployeeDialog } from "./edit-employee-dialog";

interface EmplyeesTableRowProps {
  id: number
  name: string
  password: string
}

export function EmplyeesTableRow({ id, name, password }: EmplyeesTableRowProps) {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient()

  const { mutateAsync: deleteUserFn } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUserFn({ id })

      toast.success("Usuário deletado com sucesso", {
        position: "top-center"
      })
    } catch {
      toast.error("Falha ao deletar o usuário", {
        position: "top-center"
      })
    }
  }

  const handlePrefetchUser = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['user', id],
      queryFn: () => getUser({ userId: id }),
    })
  }

  return (
    <>
      <TableRow>
        <TableCell>{id}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell className="flex items-center gap-2">
          <span>{showPassword ? password : "*******"}</span>
          <button onClick={() => setShowPassword((prev) => !prev)} aria-label="Mostrar senha">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </TableCell>

        <TableCell>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" onMouseEnter={handlePrefetchUser}>
                <Edit2 />
              </Button>
            </DialogTrigger>

            <EditEmployeeDialog
              employeeId={id}
              data={{ username: name, password }}
            />
          </Dialog>
        </TableCell>

        <TableCell>
          <Button variant="ghost" onClick={() => handleDeleteUser(id)}>
            <Trash2 className="text-red-800" />
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}