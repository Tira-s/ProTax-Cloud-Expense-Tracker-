"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Table2, Filter } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/taxUtils";

interface ExpenseTableProps {
  transactions: Transaction[];
  onUpdate: (updated: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({ transactions, onUpdate, onDelete }: ExpenseTableProps) {
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

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Table2 className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-800 font-bold">No cloud records found</p>
        <p className="text-slate-400 text-xs mt-1">Start by adding your first transaction.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
          <Table2 className="w-4 h-4 text-indigo-600" />
          Cloud Ledger
        </h2>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
          <Filter className="w-3 h-3" />
          {transactions.length} Entries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50">
              <th className="px-6 py-4">Status / Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((tx) => {
              const isEditing = editingId === tx.id;

              if (isEditing && editForm) {
                return (
                  <tr key={tx.id} className="bg-indigo-50/30">
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs w-full bg-white outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs w-full bg-white outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs w-28 text-right bg-white outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={saveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition group border-transparent border-l-2 hover:border-indigo-500">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {tx.type}
                      </span>
                      <span className="text-slate-400 text-xs font-medium tabular-nums">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{tx.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{tx.category || 'Other'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold tabular-nums text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'income' ? '+' : '-'}฿{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1 sm:opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => startEdit(tx)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(tx.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
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
