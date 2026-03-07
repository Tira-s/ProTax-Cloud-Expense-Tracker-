"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Table2, Filter, Calculator } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/taxUtils";
import { useTranslation } from "./LanguageProvider";
import CalculatorModal from "./CalculatorModal";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExpenseTableProps {
  transactions: Transaction[];
  onUpdate: (updated: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({ transactions, onUpdate, onDelete }: ExpenseTableProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.accessor('date', {
      header: t('statusDate'),
      cell: info => {
        const tx = info.row.original;
        const isEditing = editingId === tx.id;

        if (isEditing && editForm) {
          return (
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs w-full bg-white outline-none focus:border-indigo-500 font-bold"
            />
          );
        }

        return (
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {t(tx.type)}
            </span>
            <span className="text-slate-400 text-xs font-medium tabular-nums">
              {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('name', {
      header: t('description'),
      cell: info => {
        const tx = info.row.original;
        const isEditing = editingId === tx.id;

        if (isEditing && editForm) {
          return (
            <div className="space-y-2 min-w-[180px]">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs w-full bg-white outline-none focus:border-indigo-500 font-bold"
              />
              <div className="flex gap-2">
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as 'income' | 'expense' })}
                  className={`flex-1 rounded-lg border border-slate-100 px-1.5 py-1 text-[9px] font-black uppercase outline-none ${editForm.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                >
                  <option value="income">{t('income')}</option>
                  <option value="expense">{t('expense')}</option>
                </select>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-100 px-1.5 py-1 text-[9px] font-black uppercase outline-none bg-slate-50 text-slate-500"
                >
                  {["salary", "freelance", "investment", "food", "travel", "housing", "health", "other"].map(c => (
                    <option key={c} value={c}>{t(c)}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{tx.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{t(tx.category || 'other')}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('amount', {
      header: () => <div className="text-right">{t('amount')}</div>,
      cell: info => {
        const tx = info.row.original;
        const isEditing = editingId === tx.id;

        if (isEditing && editForm) {
          return (
            <div className="text-right">
              <div className="relative inline-block">
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                  className="rounded-xl border border-slate-200 pl-3 pr-8 py-2 text-xs w-32 text-right bg-white outline-none focus:border-indigo-500 font-black tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setIsCalcOpen(true)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition"
                >
                  <Calculator className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="text-right">
            <span className={`font-bold tabular-nums text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {tx.type === 'income' ? '+' : '-'}฿{formatCurrency(tx.amount)}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-center">{t('action')}</div>,
      cell: info => {
        const tx = info.row.original;
        const isEditing = editingId === tx.id;

        if (isEditing) {
          return (
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={saveEdit}
                className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition shadow-lg shadow-emerald-600/10"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center gap-1 sm:opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => startEdit(tx)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  });

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

  const handleCalcConfirm = (val: number) => {
    if (editForm) {
      setEditForm({ ...editForm, amount: val });
    }
    setIsCalcOpen(false);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Table2 className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-800 font-bold">{t('noRecords')}</p>
        <p className="text-slate-400 text-xs mt-1">{t('startAdding')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full min-w-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
          <Table2 className="w-4 h-4 text-indigo-600" />
          {t('cloudLedger')}
        </h2>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
          <Filter className="w-3 h-3" />
          {transactions.length} {t('entries')}
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 overflow-auto min-h-0 relative custom-scrollbar">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white z-20 shadow-sm">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="text-left text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 whitespace-nowrap first:rounded-tl-xl last:rounded-tr-xl">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50/50 transition group border-transparent border-l-2 hover:border-indigo-500 ${editingId === row.original.id ? 'bg-indigo-50/50' : ''}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {table.getPageCount() > 1 && (
        <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between gap-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {t('page')} {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <CalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onConfirm={handleCalcConfirm}
        initialValue={editForm?.amount.toString() || "0"}
      />
    </div>
  );
}
