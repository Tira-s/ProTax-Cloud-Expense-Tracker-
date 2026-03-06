"use client";

import { useState } from "react";
import { Plus, X, ShieldCheck } from "lucide-react";
import { Deduction } from "@/types";

interface DeductionManagerProps {
  deductions: Deduction[];
  onChange: (deductions: Deduction[]) => void;
}

export default function DeductionManager({
  deductions,
  onChange,
}: DeductionManagerProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  function handleAdd() {
    if (!name.trim() || !amount || Number(amount) <= 0) return;
    const newDeduction: Deduction = {
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: Number(amount),
    };
    onChange([...deductions, newDeduction]);
    setName("");
    setAmount("");
  }

  function handleRemove(id: string) {
    onChange(deductions.filter((d) => d.id !== id));
  }

  const total = deductions.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-violet-500" />
        ค่าลดหย่อนเพิ่มเติม
      </h2>

      {/* List */}
      {deductions.length > 0 && (
        <ul className="space-y-2 mb-4">
          {deductions.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 bg-violet-50/50 rounded-lg px-4 py-2.5 group"
            >
              <span className="text-sm text-gray-700 font-medium min-w-0 break-words">
                {d.name}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-violet-600 tabular-nums">
                  ฿{d.amount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => handleRemove(d.id)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition
                             sm:opacity-0 sm:group-hover:opacity-100"
                  title="ลบรายการลดหย่อน"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
          <li className="flex items-center justify-between px-4 pt-2 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600">รวมลดหย่อน</span>
            <span className="text-sm font-bold text-violet-700 tabular-nums">
              ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </span>
          </li>
        </ul>
      )}

      {/* Add form */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อลดหย่อน เช่น ประกันสังคม"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400
                     transition placeholder:text-gray-400"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="จำนวนเงิน"
          min="0"
          step="0.01"
          className="w-full sm:w-32 rounded-lg border border-gray-200 px-3 py-2.5 text-sm tabular-nums
                     focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400
                     transition placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-auto px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg
                     transition flex items-center justify-center gap-1.5 text-sm font-medium
                     shadow-sm shadow-violet-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม
        </button>
      </div>
    </div>
  );
}
