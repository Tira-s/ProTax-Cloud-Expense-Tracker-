"use client";

import { ReceiptText } from "lucide-react";
import { TaxResult } from "@/types";
import { formatCurrency, formatBracketRange } from "@/lib/taxUtils";

interface TaxCalculatorProps {
  result: TaxResult;
}

export default function TaxCalculator({ result }: TaxCalculatorProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <ReceiptText className="w-5 h-5 text-amber-500" />
        รายละเอียดภาษีเงินได้
      </h2>

      {/* Deduction breakdown */}
      <div className="space-y-2 mb-6">
        <Row label="เงินได้พึงประเมิน" value={result.grossIncome} />
        <Row
          label="หักค่าใช้จ่าย (50% ไม่เกิน 100,000)"
          value={-result.expenseDeduction}
          negative
        />
        <Row
          label="หักลดหย่อนส่วนตัว (60,000)"
          value={-result.personalDeduction}
          negative
        />
        {result.customDeductions > 0 && (
          <Row
            label="หักลดหย่อนอื่นๆ"
            value={-result.customDeductions}
            negative
          />
        )}
        <div className="border-t border-gray-100 pt-2 mt-2">
          <Row label="เงินได้สุทธิ" value={result.netIncome} bold />
        </div>
      </div>

      {/* Progressive brackets */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        อัตราภาษีขั้นบันได
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider">
              <th className="pb-2">ขั้นรายได้ (฿)</th>
              <th className="pb-2 text-center">อัตรา</th>
              <th className="pb-2 text-right">ภาษี (฿)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {result.brackets.map((b, i) => (
              <tr
                key={i}
                className={
                  b.taxAmount > 0 ? "text-gray-800" : "text-gray-300"
                }
              >
                <td className="py-2 tabular-nums">
                  {formatBracketRange(b.min, b.max)}
                </td>
                <td className="py-2 text-center tabular-nums">
                  {(b.rate * 100).toFixed(0)}%
                </td>
                <td className="py-2 text-right font-medium tabular-nums">
                  {formatCurrency(b.taxAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200">
              <td colSpan={2} className="py-3 font-bold text-gray-800">
                ภาษีรวมที่ต้องชำระ
              </td>
              <td className="py-3 text-right font-bold text-amber-600 text-lg tabular-nums">
                ฿{formatCurrency(result.totalTax)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  negative,
  bold,
}: {
  label: string;
  value: number;
  negative?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span
        className={`text-sm min-w-0 break-words ${
          bold ? "font-bold text-gray-800" : "text-gray-600"
        }`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 tabular-nums text-sm ${
          bold
            ? "font-bold text-gray-800"
            : negative
            ? "text-rose-500"
            : "text-gray-800"
        }`}
      >
        {negative ? "-" : ""}฿{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
