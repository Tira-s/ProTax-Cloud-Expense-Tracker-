"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calculator,
} from "lucide-react";
import { formatCurrency } from "@/lib/taxUtils";

interface SummaryDashboardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTax: number;
}

const cards = [
  {
    key: "income",
    label: "รายรับรวม",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
  {
    key: "expense",
    label: "รายจ่ายรวม",
    icon: TrendingDown,
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-100",
  },
  {
    key: "balance",
    label: "คงเหลือ",
    icon: Wallet,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-100",
  },
  {
    key: "tax",
    label: "ภาษีที่ต้องชำระ",
    icon: Calculator,
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
  },
] as const;

export default function SummaryDashboard({
  totalIncome,
  totalExpense,
  balance,
  totalTax,
}: SummaryDashboardProps) {
  const values: Record<string, number> = {
    income: totalIncome,
    expense: totalExpense,
    balance,
    tax: totalTax,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3
                       bg-white ring-1 ${c.ring} hover:shadow-md transition`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-500">
                {c.label}
              </span>
            </div>
            <p className={`text-2xl font-bold tabular-nums tracking-tight ${c.color}`}>
              ฿{formatCurrency(values[c.key])}
            </p>
          </div>
        );
      })}
    </div>
  );
}
