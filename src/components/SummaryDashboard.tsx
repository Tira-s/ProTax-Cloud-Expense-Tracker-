"use client";

import { TrendingUp, TrendingDown, Wallet, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/taxUtils";

interface SummaryDashboardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTax: number;
}

export default function SummaryDashboard({ totalIncome, totalExpense, balance, totalTax }: SummaryDashboardProps) {
  const cards = [
    { label: "Gross Income", val: totalIncome, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-100" },
    { label: "Expenses", val: totalExpense, icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-500/10", border: "border-rose-100" },
    { label: "Net Balance", val: balance, icon: Wallet, color: "text-slate-900", bg: "bg-slate-500/10", border: "border-slate-100" },
    { label: "Tax Payable", val: totalTax, icon: Calculator, color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-100" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm hover:shadow-md transition group overflow-hidden relative`}>
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</span>
            <span className={`text-xl sm:text-2xl font-black tabular-nums tracking-tighter ${c.color}`}>
              ฿{formatCurrency(c.val)}
            </span>
          </div>
          <div className={`absolute -right-2 -bottom-2 p-4 rounded-full ${c.bg} transition-transform group-hover:scale-110 opacity-50`}>
            <c.icon className={`w-8 h-8 ${c.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
