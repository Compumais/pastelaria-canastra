"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { GetTotalRevenueOnMonthResponse } from "@/api/get-total-revenue-on-month";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

interface LastMonthRevenueChartProps {
  data: GetTotalRevenueOnMonthResponse[]
}

const chartConfig = {
  day: {
    label: "Total",
    color: "#2563eb",
  }
} satisfies ChartConfig


export function LastMonthRevenueChart(props: LastMonthRevenueChartProps) {
  console.log("dashboard =>", props)
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={props.data}>
        <CartesianGrid vertical strokeDasharray="3 3" />
        <XAxis
          dataKey="data"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const [day, month, year] = value.split("/").map(Number);
            const date = new Date(2000 + year, month - 1, day);
            return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
          }}
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
        <Bar dataKey="valor" fill="var(--color-day)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}