"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Table2 } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/taxUtils";

interface ExpenseTableProps {
  transactions: Transaction[];
  onUpdate: (updated: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({
  transactions,
  onUpdate,
  onDelete,
}: ExpenseTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  function startEdit(tx: Transaction) {
    setEditingId(tx.id);
    setEditForm({ ...tx });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  function saveEdit() {
    if (editForm && editForm.name.trim() && editForm.amount > 0) {
      onUpdate(editForm);
      cancelEdit();
    }
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <Table2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">ยังไม่มีรายการ</p>
        <p className="text-gray-300 text-xs mt-1">
          เพิ่มรายการแรกจากฟอร์มด้านบน
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Table2 className="w-5 h-5 text-indigo-500" />
          รายการทั้งหมด
          <span className="text-sm font-normal text-gray-400 ml-1">
            ({transactions.length} รายการ)
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider">
              <th className="px-6 py-3">วันที่</th>
              <th className="px-6 py-3">รายการ</th>
              <th className="px-6 py-3">ประเภท</th>
              <th className="px-6 py-3 text-right">จำนวนเงิน</th>
              <th className="px-6 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((tx) => {
              const isEditing = editingId === tx.id;

              if (isEditing && editForm) {
                return (
                  <tr key={tx.id} className="bg-indigo-50/40">
                    <td className="px-6 py-3">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        className="rounded-md border border-gray-200 px-2 py-1.5 text-sm w-36
                                   focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="rounded-md border border-gray-200 px-2 py-1.5 text-sm w-full
                                   focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        className="rounded-md border border-gray-200 px-2 py-1.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                      >
                        <option value="income">รายรับ</option>
                        <option value="expense">รายจ่าย</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            amount: Number(e.target.value),
                          })
                        }
                        className="rounded-md border border-gray-200 px-2 py-1.5 text-sm w-28 text-right tabular-nums
                                   focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={saveEdit}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                          title="บันทึก"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                          title="ยกเลิก"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50/60 transition group"
                >
                  <td className="px-6 py-3.5 text-gray-500 tabular-nums">
                    {new Date(tx.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-gray-800">
                    {tx.name}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          tx.type === "income"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                    >
                      {tx.type === "income" ? "รายรับ" : "รายจ่าย"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-3.5 text-right font-semibold tabular-nums ${
                      tx.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}฿
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-1 sm:opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => startEdit(tx)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="แก้ไข"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
