"use client"

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import colors from "tailwindcss/colors"

import type { GetWaiterTotalOnMonthResponse } from "@/api/get-waiter-total-on-month"

interface PieChartComponentProps {
  data: GetWaiterTotalOnMonthResponse[]
}

const COLOR_PALETTE = [
  colors.amber[500],
  colors.blue[500],
  colors.violet[500],
  colors.emerald[500],
  colors.lime[500],
  colors.yellow[500],
  colors.sky[500],
  colors.gray[500],
  colors.fuchsia[500],
  colors.orange[500],
  colors.teal[500],
  colors.pink[500],
  colors.stone[500],
  colors.rose[500],
  colors.red[500],
  colors.purple[500],
]

export function WaiterTotalOnMonthChart({ data }: PieChartComponentProps) {
  const formattedData = data.map((item) => ({
    ...item,
    value: Number(item.valor),
  }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={formattedData}
          dataKey="value"
          nameKey="nome"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          isAnimationActive
        >
          {formattedData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0px 0px 6px rgba(0,0,0,0.1)",
          }}
          formatter={(value: number, name: string) => [
            `R$ ${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`,
            name,
          ]}
        />

        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{ marginTop: 20 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
