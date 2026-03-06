"use client";

import { Download, FileDown } from "lucide-react";
import { Transaction, Deduction, TaxResult } from "@/types";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  transactions: Transaction[];
  deductions: Deduction[];
  taxResult: TaxResult;
}

export default function ExportButton({ transactions, deductions, taxResult }: ExportButtonProps) {
  function handleExport() {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Cloud Ledger (Transactions)
    const txData = transactions.map((tx) => ({
      Date: tx.date,
      Title: tx.name,
      Category: tx.category || "Other",
      Type: tx.type === "income" ? "INCOME" : "EXPENSE",
      "Amount (฿)": tx.amount,
    }));
    const ws1 = XLSX.utils.json_to_sheet(txData);
    ws1["!cols"] = [{ wch: 14 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Transactions");

    // Sheet 2: Deductions
    const dedData = [
      { Item: "Personal Deduction (Base)", Amount: taxResult.personalDeduction },
      { Item: "Expense Deduction (50% cap 100k)", Amount: taxResult.expenseDeduction },
      ...deductions.map((d) => ({
        Item: d.name,
        Amount: d.amount,
      })),
    ];
    const ws2 = XLSX.utils.json_to_sheet(dedData);
    ws2["!cols"] = [{ wch: 35 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Deductions");

    // Sheet 3: ProTax Summary
    const summaryData = [
      { Metric: "Gross Income", Value: taxResult.grossIncome },
      { Metric: "Total Deductions", Value: taxResult.totalDeductions },
      { Metric: "Net Taxable Income", Value: taxResult.netIncome },
      { Metric: "", Value: "" },
      ...taxResult.brackets
        .filter((b) => b.taxAmount > 0)
        .map((b) => ({
          Metric: `Tax Rate ${(b.rate * 100).toFixed(0)}%`,
          Value: b.taxAmount,
        })),
      { Metric: "", Value: "" },
      { Metric: "TOTAL TAX PAYABLE", Value: taxResult.totalTax },
    ];
    const ws3 = XLSX.utils.json_to_sheet(summaryData);
    ws3["!cols"] = [{ wch: 35 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws3, "Tax Summary");

    // Download with professional naming
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `ProTax_Cloud_Report_${dateStr}.xlsx`);
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
      <span className="hidden sm:inline">Export Ledger</span>
    </button>
  );
}
