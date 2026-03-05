"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import type { FluxoHorarioResponse } from "@/api/get-fluxo-horario";

interface PeakHourChartProps {
  data: FluxoHorarioResponse[]
}

const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "#2563eb",
  }
} satisfies ChartConfig

export function PeakHourChart({ data }: PeakHourChartProps) {
  const maxVendas = Math.max(...data.map(d => d.vendas));

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="hora"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(value) => `${value}:00h`}
            />
          }
        />
        <Bar dataKey="vendas" radius={4}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.vendas === maxVendas && maxVendas > 0 ? "var(--color-vendas)" : "#94a3b8"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
