"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, Deduction } from "@/types";
import { calculateTax } from "@/lib/taxUtils";

import SummaryDashboard from "@/components/SummaryDashboard";
import ExpenseForm from "@/components/ExpenseForm";
import DeductionManager from "@/components/DeductionManager";
import ExpenseTable from "@/components/ExpenseTable";
import TaxCalculator from "@/components/TaxCalculator";
import ExportButton from "@/components/ExportButton";
import { Receipt } from "lucide-react";

const STORAGE_KEYS = {
  transactions: "stx_transactions",
  deductions: "stx_deductions",
};

export default function HomePage() {
  /* ── State ──────────────────────────────────── */
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* ── Load from LocalStorage ─────────────────── */
  useEffect(() => {
    try {
      const savedTx = localStorage.getItem(STORAGE_KEYS.transactions);
      const savedDed = localStorage.getItem(STORAGE_KEYS.deductions);
      if (savedTx) setTransactions(JSON.parse(savedTx));
      if (savedDed) setDeductions(JSON.parse(savedDed));
    } catch {
      /* ignore corrupted data */
    }
    setLoaded(true);
  }, []);

  /* ── Persist to LocalStorage ────────────────── */
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions)
    );
  }, [transactions, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.deductions, JSON.stringify(deductions));
  }, [deductions, loaded]);

  /* ── Handlers ───────────────────────────────── */
  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [...prev, tx]);
  }, []);

  const updateTransaction = useCallback((updated: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Computed ───────────────────────────────── */
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpense;

  const taxResult = useMemo(
    () => calculateTax(totalIncome, deductions),
    [totalIncome, deductions]
  );

  /* ── Loading guard ─────────────────────────── */
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">กำลังโหลด...</div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-xl shadow-sm shadow-indigo-500/20">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Smart Tax Tracker
              </h1>
              <p className="text-xs text-gray-400">
                บันทึกรายรับ-รายจ่าย & คำนวณภาษี
              </p>
            </div>
          </div>
          <ExportButton
            transactions={transactions}
            deductions={deductions}
            taxResult={taxResult}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Dashboard Cards */}
        <SummaryDashboard
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          totalTax={taxResult.totalTax}
        />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form + Deductions */}
          <div className="lg:col-span-2 space-y-6">
            <ExpenseForm onAdd={addTransaction} />
            <DeductionManager
              deductions={deductions}
              onChange={setDeductions}
            />
          </div>

          {/* Right: Tax Calculator */}
          <div className="lg:col-span-3">
            <TaxCalculator result={taxResult} />
          </div>
        </div>

        {/* Full-width Table */}
        <ExpenseTable
          transactions={transactions}
          onUpdate={updateTransaction}
          onDelete={deleteTransaction}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
          Smart Tax & Expense Tracker — คำนวณภาษีเงินได้บุคคลธรรมดาตามอัตราขั้นบันไดปี 2567
        </div>
      </footer>
    </div>
  );
}
