"use client";

import { useState } from "react";
import { PlusCircle, Tag, Banknote, Calendar, Calculator } from "lucide-react";
import { Transaction } from "@/types";
import { generateId } from "@/lib/idUtils";
import CalculatorModal from "./CalculatorModal";
import { useTranslation } from "./LanguageProvider";

interface ExpenseFormProps {
  onAdd: (tx: Transaction) => void;
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("other");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const categories = [
    "salary", "freelance", "investment", "food", "travel", "housing", "health", "other"
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;

    onAdd({
      id: generateId(),
      name: name.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    });

    setName("");
    setAmount("");
  }

  const handleCalcConfirm = (val: number) => {
    setAmount(val.toString());
    setIsCalcOpen(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 h-full"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{t('addTransaction')}</h2>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3" /> {t('title')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('placeholderTitle')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm
                         focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                         transition placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Amount & Category Wrapper */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-between h-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-indigo-500" /> {t('amount')}
                </label>
                <button 
                  type="button"
                  onClick={() => setIsCalcOpen(true)}
                  className="p-1 hover:bg-indigo-50 rounded-md transition text-slate-400 hover:text-indigo-600"
                  title="Open Calculator"
                >
                  <Calculator className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm tabular-nums
                             focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                             transition placeholder:text-slate-400 font-bold"
                />
              </div>
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="h-4 flex items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> {t('category')}
                </label>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm
                           focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                           transition font-bold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                {categories.map(c => <option key={c} value={c}>{t(c)}</option>)}
              </select>
            </div>
          </div>

          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all
                ${type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t('income')}
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all
                ${type === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t('expense')}
            </button>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {t('date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm
                         focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                         transition font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-black text-white font-bold
                     py-3 rounded-xl transition shadow-xl shadow-slate-900/10
                     active:scale-[0.98] text-sm"
        >
          {t('syncToCloud')}
        </button>
      </form>

      <CalculatorModal 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
        onConfirm={handleCalcConfirm} 
        initialValue={amount}
      />
    </>
  );
}
