"use client";

import { ReceiptText, CheckCircle2, AlertCircle } from "lucide-react";
import { TaxResult } from "@/types";
import { formatCurrency, formatBracketRange } from "@/lib/taxUtils";

interface TaxCalculatorProps {
  result: TaxResult;
}

export default function TaxCalculator({ result }: TaxCalculatorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <ReceiptText className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Tax Report Analysis</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" /> Updated Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Calculation Summary */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-l-2 border-slate-200 pl-3">Deduction Breakdown</h3>
          <div className="space-y-3 px-3">
            <Row label="Gross Income" value={result.grossIncome} />
            <Row label="Expenses (50% cap 100k)" value={-result.expenseDeduction} negative />
            <Row label="Personal Deduction" value={-result.personalDeduction} negative />
            {result.customDeductions > 0 && <Row label="Other Deductions" value={-result.customDeductions} negative />}
            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-black text-slate-900">Net Taxable Income</span>
              <span className="text-lg font-black text-slate-900 tabular-nums">฿{formatCurrency(result.netIncome)}</span>
            </div>
          </div>
        </div>

        {/* Right: Progressive Rates */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-l-2 border-slate-200 pl-3">Progressive Tax Engine</h3>
          <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr className="text-left text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  <th className="px-4 py-3">Bracket (฿)</th>
                  <th className="px-4 py-3 text-center">Rate</th>
                  <th className="px-4 py-3 text-right">Tax (฿)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {result.brackets.map((b, i) => (
                  <tr key={i} className={`transition-colors ${b.taxAmount > 0 ? "bg-indigo-50/20 text-indigo-900 font-bold" : "text-slate-300"}`}>
                    <td className="px-4 py-2.5 tabular-nums">{formatBracketRange(b.min, b.max)}</td>
                    <td className="px-4 py-2.5 text-center font-black">{(b.rate * 100).toFixed(0)}%</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatCurrency(b.taxAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/20">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <AlertCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Total Tax Payable</p>
            <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tighter tabular-nums">฿{formatCurrency(result.totalTax)}</h4>
          </div>
        </div>
        <div className="text-indigo-400/50 font-black text-5xl hidden sm:block italic tracking-tighter opacity-20">PRO TAX</div>
      </div>
    </div>
  );
}

function Row({ label, value, negative }: { label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight min-w-0 break-words">{label}</span>
      <span className={`shrink-0 tabular-nums font-black text-sm ${negative ? "text-rose-500" : "text-slate-900"}`}>
        {negative ? "-" : ""}฿{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
