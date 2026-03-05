"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { GetTotalRevenueOnSixMonthsResponse } from "@/api/get-total-revenue-on-siex-months";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

interface LastSixMonthsRevenueChartProps {
  data: GetTotalRevenueOnSixMonthsResponse[]
}

const chartConfig = {
  day: {
    label: "Total",
    color: "#2563eb",
  }
} satisfies ChartConfig


export function LastSixMonthsRevenueChart(
  props: LastSixMonthsRevenueChartProps
) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={props.data}>
        <CartesianGrid vertical strokeDasharray="3 3" />
        <XAxis
          dataKey="mes"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                typeof value === "number"
                  ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  : value
              }
            />
          }
        />
        <Bar dataKey="total_mes" fill="var(--color-day)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
