"use client";

import { FileText, Calculator, ChevronRight, Info, CheckCircle2, Landmark } from "lucide-react";
import { TaxResult } from "@/types";
import { formatCurrency } from "@/lib/taxUtils";
import { useTranslation } from "./LanguageProvider";

interface TaxCalculatorProps {
  result: TaxResult;
}

export default function TaxCalculator({ result }: TaxCalculatorProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{t('logicReport')}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
              {t('taxReport')}
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('taxableIncome')}</span>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
              ฿{result.netIncome.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Deductions & Allowances Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('totalIncome')}</span>
            <p className="text-xl font-black text-slate-900 tabular-nums">฿{result.grossIncome.toLocaleString()}</p>
          </div>
          <div className="p-5 bg-emerald-50/30 rounded-3xl border border-emerald-100/50 space-y-1">
            <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">{t('standardDeduction')}</span>
            <p className="text-xl font-black text-emerald-600 tabular-nums">-฿{result.expenseDeduction.toLocaleString()}</p>
          </div>
          <div className="p-5 bg-emerald-50/30 rounded-3xl border border-emerald-100/50 space-y-1">
            <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">{t('personalAllowance')}</span>
            <p className="text-xl font-black text-emerald-600 tabular-nums">-฿{result.personalDeduction.toLocaleString()}</p>
          </div>
          <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-1">
            <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">{t('totalManualDeduction')}</span>
            <p className="text-xl font-black text-indigo-600 tabular-nums">-฿{result.customDeductions.toLocaleString()}</p>
          </div>
        </div>

        {/* Tax Breakdown Table */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('taxBreakdown')}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('bracket')}</th>
                  <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('rate')}</th>
                  <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('taxAmount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {result.brackets.map((b, idx) => (
                  <tr key={idx} className={`group transition-colors ${b.taxAmount > 0 ? 'bg-indigo-50/30' : ''}`}>
                    <td className="py-4 px-2 rounded-l-2xl">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className={`text-sm font-bold ${b.taxAmount > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                           ฿{b.min.toLocaleString()} - {b.max === Infinity ? t('more') || 'Up' : `฿${b.max.toLocaleString()}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${b.taxAmount > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                        {(b.rate * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-4 text-right px-2 rounded-r-2xl">
                      <span className={`text-sm font-black tabular-nums ${b.taxAmount > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                        ฿{b.taxAmount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grand Total Footer */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-900/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-300">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">{t('estimatedTax')}</p>
              <p className="text-white/60 text-xs font-medium">{t('taxReport')}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
              ฿{result.totalTax.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
