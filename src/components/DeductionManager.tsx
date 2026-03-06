"use client";

import { useState } from "react";
import { Plus, X, ShieldCheck, HeartPulse, Calculator } from "lucide-react";
import { Deduction } from "@/types";
import { generateId } from "@/lib/idUtils";
import CalculatorModal from "./CalculatorModal";

interface DeductionManagerProps {
  deductions: Deduction[];
  onChange: (deductions: Deduction[]) => void;
}

export default function DeductionManager({ deductions, onChange }: DeductionManagerProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  function handleAdd() {
    if (!name.trim() || !amount || Number(amount) <= 0) return;
    const newDeduction: Deduction = {
      id: generateId(),
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

  const handleCalcConfirm = (val: number) => {
    setAmount(val.toString());
    setIsCalcOpen(false);
  };

  const total = deductions.reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
          <ShieldCheck className="w-5 h-5 text-violet-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Manual Deductions</h2>
        </div>

        <div className="space-y-3">
          {deductions.map((d) => (
            <div key={d.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 group animate-in fade-in slide-in-from-left-2 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                  <HeartPulse className="w-3 h-3 text-violet-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{d.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-violet-600 tabular-nums">
                  ฿{d.amount.toLocaleString("en-US")}
                </span>
                <button
                  onClick={() => handleRemove(d.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {deductions.length > 0 && (
            <div className="flex justify-between px-4 py-2 border-t border-slate-100 mt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Custom</span>
              <span className="text-sm font-black text-slate-900 tabular-nums">฿{total.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 pt-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Deduction Name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none font-medium"
          />
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full sm:w-28 rounded-xl border border-slate-200 bg-slate-50/50 pl-3.5 pr-8 py-2 text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none font-medium tabular-nums"
            />
            <button 
              type="button"
              onClick={() => setIsCalcOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-violet-600 transition"
            >
              <Calculator className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto p-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition shadow-lg shadow-violet-600/10 active:scale-95 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CalculatorModal 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
        onConfirm={handleCalcConfirm} 
        initialValue={amount}
      />
    </>
  );
}
