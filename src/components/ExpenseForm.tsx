"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Transaction } from "@/types";

interface ExpenseFormProps {
  onAdd: (tx: Transaction) => void;
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      amount: Number(amount),
      type,
      date,
    });

    setName("");
    setAmount("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-500" />
        เพิ่มรายการ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            ชื่อรายการ
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น เงินเดือน, ค่าอาหาร"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                       transition placeholder:text-gray-400"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            จำนวนเงิน (฿)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm tabular-nums
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                       transition placeholder:text-gray-400"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            ประเภท
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  type === "income"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              💰 รายรับ
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  type === "expense"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              💸 รายจ่าย
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            วันที่
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                       transition"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold
                   py-3 rounded-xl transition shadow-sm shadow-indigo-500/20
                   active:scale-[0.98]"
      >
        + เพิ่มรายการ
      </button>
    </form>
  );
}
