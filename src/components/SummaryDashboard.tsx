"use client";

import { TrendingUp, TrendingDown, Wallet, Landmark } from "lucide-react";
import { useTranslation } from "./LanguageProvider";
import { formatCurrency } from "@/lib/taxUtils";

interface SummaryDashboardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTax: number;
}

export default function SummaryDashboard({ totalIncome, totalExpense, balance, totalTax }: SummaryDashboardProps) {
  const { t } = useTranslation();

  const cards = [
    { title: t('totalIncome'), amount: totalIncome, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: t('totalExpense'), amount: totalExpense, icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: t('balance'), amount: balance, icon: Wallet, color: "text-slate-900", bg: "bg-slate-50", border: "border-slate-200 shadow-sm" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Landmark className="w-5 h-5 text-slate-800" />
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tighter">{t('summaryTitle')}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`p-5 rounded-[2rem] border transition-all hover:scale-[1.02] ${card.bg} ${card.border}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.title}</span>
              <div className={`p-2 rounded-xl bg-white/60 shadow-sm`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-black tracking-tighter tabular-nums ${card.color}`}>
              ฿{card.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
