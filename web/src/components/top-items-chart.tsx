"use client"

import { Pie, PieChart, Cell, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import type { TopProdutosResponse } from "@/api/get-top-produtos"

interface TopItemsChartProps {
  data: TopProdutosResponse[]
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const chartConfig = {
  quantidade: {
    label: "Quantidade",
  },
} satisfies ChartConfig

export function TopItemsChart({ data }: TopItemsChartProps) {
  // Transform data for the chart if needed (already in {produto, quantidade} format)
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="quantidade"
          nameKey="produto"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value) => <span className="text-xs font-medium text-gray-600">{value}</span>}
        />
      </PieChart>
    </ChartContainer>
  )
}
