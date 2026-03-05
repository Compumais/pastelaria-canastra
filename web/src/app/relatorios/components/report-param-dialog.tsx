import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export type ReportType = "periodo" | "mensal" | "desempenho" | "fluxo" | "ticket";

interface ReportParamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: ReportType | null;
  onConfirm: (params: Record<string, string>) => void;
}

export function ReportParamDialog({
  isOpen,
  onOpenChange,
  reportType,
  onConfirm,
}: ReportParamDialogProps) {
  const [params, setParams] = useState<Record<string, string>>({ formato: "txt" });

  useEffect(() => {
    if (isOpen) {
      setParams({ formato: "txt" });
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(params);
    onOpenChange(false);
  };

  const renderFields = () => {
    return (
      <div className="grid gap-4 py-4">
        {reportType === "periodo" && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inicio" className="text-right">Início</Label>
              <Input
                id="inicio"
                type="date"
                className="col-span-3"
                onChange={(e) => setParams({ ...params, inicio: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fim" className="text-right">Fim</Label>
              <Input
                id="fim"
                type="date"
                className="col-span-3"
                onChange={(e) => setParams({ ...params, fim: e.target.value })}
              />
            </div>
          </>
        )}

        {reportType === "mensal" && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mes" className="text-right">Mês</Label>
              <Input
                id="mes"
                type="number"
                min="1"
                max="12"
                placeholder="03"
                className="col-span-3"
                onChange={(e) => setParams({ ...params, mes: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ano" className="text-right">Ano</Label>
              <Input
                id="ano"
                type="number"
                placeholder="2024"
                className="col-span-3"
                onChange={(e) => setParams({ ...params, ano: e.target.value })}
              />
            </div>
          </>
        )}

        {reportType === "desempenho" && (
          <div className="py-2">
            <p className="text-sm text-muted-foreground">Deseja visualizar o desempenho dos garçons do mês atual?</p>
          </div>
        )}

        {(reportType === "fluxo" || reportType === "ticket") && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inicio" className="text-right">Início</Label>
              <Input
                id="inicio"
                type="date"
                className="col-span-3"
                onChange={(e) => setParams({ ...params, inicio: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fim" className="text-right">Fim</Label>
              <Input
                id="fim"
                type="date"
                className="col-span-3"
                onChange={(e) => setParams({ ...params, fim: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="formato" className="text-right">Formato</Label>
          <div className="col-span-3">
            <Select
              value={params.formato}
              onValueChange={(value) => setParams({ ...params, formato: value })}
            >
              <SelectTrigger id="formato">
                <SelectValue placeholder="Escolha o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">Arquivo de Texto (.txt)</SelectItem>
                <SelectItem value="csv">Planilha (.csv)</SelectItem>
                <SelectItem value="html">Página Web (.html)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const getTitle = () => {
    switch (reportType) {
      case "periodo":
        return "Relatório de Vendas por Período";
      case "mensal":
        return "Resumo de Itens Vendidos (Mensal)";
      case "desempenho":
        return "Desempenho de Garçons";
      case "fluxo":
        return "Análise de Horário de Pico";
      case "ticket":
        return "Análise de Ticket Médio";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {reportType === "desempenho"
              ? "Confirme o formato para gerar o relatório de desempenho."
              : "Preencha os parâmetros e escolha o formato do relatório."}
          </DialogDescription>
        </DialogHeader>
        {renderFields()}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Gerar Relatório</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
