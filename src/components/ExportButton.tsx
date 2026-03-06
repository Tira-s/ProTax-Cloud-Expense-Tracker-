"use client";

import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Transaction, Deduction, TaxResult } from "@/types";
import { useTranslation } from "./LanguageProvider";

interface ExportButtonProps {
  transactions: Transaction[];
  deductions: Deduction[];
  taxResult: TaxResult;
}

export default function ExportButton({ transactions, deductions, taxResult }: ExportButtonProps) {
  const { t } = useTranslation();

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // 1. Transactions Sheet
    const txData = transactions.map(t_item => ({
      [t('exportHeaderDate')]: t_item.date,
      [t('exportHeaderName')]: t_item.name,
      [t('category')]: t(t_item.category || 'other'),
      [t('type')]: t(t_item.type),
      [t('exportHeaderAmount')]: t_item.amount,
    }));
    const txSheet = XLSX.utils.json_to_sheet(txData);
    txSheet["!cols"] = [{ wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, txSheet, t('cloudLedger'));

    // 2. Tax Summary Sheet
    const summaryData = [
      { [t('description')]: t('totalIncome'), [t('amount')]: taxResult.grossIncome },
      { [t('description')]: t('standardDeduction'), [t('amount')]: taxResult.expenseDeduction },
      { [t('description')]: t('personalAllowance'), [t('amount')]: taxResult.personalDeduction },
      { [t('description')]: t('totalCustom'), [t('amount')]: taxResult.customDeductions },
      { [t('description')]: "", [t('amount')]: "" },
      { [t('description')]: t('taxableIncome'), [t('amount')]: taxResult.netIncome },
      { [t('description')]: t('taxAmount') + " (Net)", [t('amount')]: taxResult.totalTax },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!cols"] = [{ wch: 35 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, t('summaryTitle'));

    // Download
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `ProTax_Report_${dateStr}.xlsx`);
  }

  return (
    <button
      onClick={handleExport}
      disabled={transactions.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black 
                 text-white text-xs font-bold rounded-xl transition shadow-xl shadow-slate-900/10
                 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
    >
      <FileDown className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
      <span className="hidden sm:inline">{t('export')}</span>
    </button>
  );
}
