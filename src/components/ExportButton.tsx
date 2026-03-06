"use client";

import { Download } from "lucide-react";
import { Transaction, Deduction } from "@/types";
import { TaxResult } from "@/types";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  transactions: Transaction[];
  deductions: Deduction[];
  taxResult: TaxResult;
}

export default function ExportButton({
  transactions,
  deductions,
  taxResult,
}: ExportButtonProps) {
  function handleExport() {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Transactions
    const txData = transactions.map((tx) => ({
      วันที่: tx.date,
      รายการ: tx.name,
      ประเภท: tx.type === "income" ? "รายรับ" : "รายจ่าย",
      "จำนวนเงิน (฿)": tx.amount,
    }));
    const ws1 = XLSX.utils.json_to_sheet(txData);
    ws1["!cols"] = [{ wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws1, "รายการทั้งหมด");

    // Sheet 2: Deductions
    if (deductions.length > 0) {
      const dedData = deductions.map((d) => ({
        "ชื่อลดหย่อน": d.name,
        "จำนวนเงิน (฿)": d.amount,
      }));
      const ws2 = XLSX.utils.json_to_sheet(dedData);
      ws2["!cols"] = [{ wch: 30 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws2, "ค่าลดหย่อน");
    }

    // Sheet 3: Tax Summary
    const summaryData = [
      { รายการ: "เงินได้พึงประเมิน", "จำนวนเงิน (฿)": taxResult.grossIncome },
      {
        รายการ: "หักค่าใช้จ่าย (50% ไม่เกิน 100,000)",
        "จำนวนเงิน (฿)": taxResult.expenseDeduction,
      },
      {
        รายการ: "หักลดหย่อนส่วนตัว",
        "จำนวนเงิน (฿)": taxResult.personalDeduction,
      },
      {
        รายการ: "หักลดหย่อนอื่นๆ",
        "จำนวนเงิน (฿)": taxResult.customDeductions,
      },
      { รายการ: "เงินได้สุทธิ", "จำนวนเงิน (฿)": taxResult.netIncome },
      { รายการ: "", "จำนวนเงิน (฿)": "" },
      ...taxResult.brackets
        .filter((b) => b.taxAmount > 0)
        .map((b) => ({
          รายการ: `ภาษีอัตรา ${(b.rate * 100).toFixed(0)}%`,
          "จำนวนเงิน (฿)": b.taxAmount,
        })),
      { รายการ: "ภาษีรวมที่ต้องชำระ", "จำนวนเงิน (฿)": taxResult.totalTax },
    ];
    const ws3 = XLSX.utils.json_to_sheet(summaryData);
    ws3["!cols"] = [{ wch: 35 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws3, "สรุปภาษี");

    // Download
    XLSX.writeFile(wb, `SmartTax_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <button
      onClick={handleExport}
      disabled={transactions.length === 0}
      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600
                 text-white font-semibold rounded-xl transition shadow-sm shadow-emerald-500/20
                 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      <Download className="w-5 h-5" />
      ส่งออก Excel
    </button>
  );
}
