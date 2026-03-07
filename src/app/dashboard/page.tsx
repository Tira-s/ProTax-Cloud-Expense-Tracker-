"use client";

import { useAuth } from "@/components/AuthProvider";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, Deduction, TaxResult } from "@/types";
import { calculateTax } from "@/lib/taxUtils";
import { supabase } from "@/lib/supabase";

import SummaryDashboard from "@/components/SummaryDashboard";
import ExpenseForm from "@/components/ExpenseForm";
import DeductionManager from "@/components/DeductionManager";
import ExpenseTable from "@/components/ExpenseTable";
import TaxCalculator from "@/components/TaxCalculator";
import ExportButton from "@/components/ExportButton";
import { useTranslation } from "@/components/LanguageProvider";
import {
  Languages,
  ArrowRight,
  Loader2,
  Receipt,
  Cloud,
  LogOut,
  ArrowUpDown,
  Clock,
  Calendar,
  Coins,
  Tag,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { sanitizeText, isValidAmount } from "@/lib/securityUtils";


export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch data from Supabase (Hardened with generic errors)
  const fetchData = useCallback(async (showLoading = false) => {
    if (!user) return;
    if (showLoading) setDataLoading(true);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order(sortBy, { ascending: sortOrder === "asc" });

      if (error) throw error;
      if (data) setTransactions(data);

      const { data: dedData, error: dedError } = await supabase
        .from('deductions')
        .select('*')
        .eq('user_id', user.id);

      if (dedError) throw dedError;
      if (dedData) setDeductions(dedData);
    } catch (err) {
      console.error("Data fetch failed. Authentication or connection issue.");
    } finally {
      if (showLoading) setDataLoading(false);
    }
  }, [user, sortBy, sortOrder]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Handlers with Optimistic UI & Background Sync
  const addTransaction = async (tx: Transaction) => {
    if (!user || !isValidAmount(tx.amount)) return;

    const sanitizedTx = {
      ...tx,
      name: sanitizeText(tx.name),
      user_id: user.id
    };

    // 1. Optimistic Update
    setTransactions(prev => [sanitizedTx, ...prev]);

    // 2. Background Sync
    const { error } = await supabase.from('transactions').insert([sanitizedTx]);

    // 3. Re-verify with server
    fetchData();
    if (error) console.error("Sync failed.");
  };

  const updateTransaction = async (updated: Transaction) => {
    if (!user || !isValidAmount(updated.amount)) return;

    const sanitizedUpdate = {
      ...updated,
      name: sanitizeText(updated.name)
    };

    // 1. Optimistic Update
    setTransactions(prev => prev.map(t => (t.id === updated.id ? sanitizedUpdate : t)));

    // 2. Background Sync
    const { error } = await supabase.from('transactions')
      .update({
        name: sanitizedUpdate.name,
        amount: sanitizedUpdate.amount,
        type: sanitizedUpdate.type,
        date: sanitizedUpdate.date
      })
      .eq('id', updated.id)
      .eq('user_id', user.id);

    // 3. Re-verify
    fetchData();
    if (error) console.error("Update failed.");
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    // 1. Optimistic Update
    setTransactions(prev => prev.filter(t => t.id !== id));

    // 2. Background Sync
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);

    // 3. Re-verify
    fetchData();
    if (error) console.error("Delete failed.");
  };

  const addDeduction = async (deduction: Deduction) => {
    if (!user) return;

    // Ensure only the expected fields are sent to Supabase
    const sanitizedDeduction = {
      id: deduction.id,
      user_id: user.id || "", // Fallback
      name: sanitizeText(deduction.name),
      amount: deduction.amount
    };

    // 1. Optimistic Update
    setDeductions(prev => [...prev, sanitizedDeduction]);

    // 2. Background Sync
    const { error } = await supabase.from('deductions').insert([sanitizedDeduction]);

    // 3. Re-verify
    fetchData();
    if (error) console.error("Deduction sync failed:", error.message);
  };

  const updateDeduction = async (updated: Deduction) => {
    if (!user || !isValidAmount(updated.amount)) return;

    const sanitizedUpdate = {
      ...updated,
      name: sanitizeText(updated.name)
    };

    // 1. Optimistic Update
    setDeductions(prev => prev.map(d => (d.id === updated.id ? sanitizedUpdate : d)));

    // 2. Background Sync
    const { error } = await supabase.from('deductions')
      .update({
        name: sanitizedUpdate.name,
        amount: sanitizedUpdate.amount
      })
      .eq('id', updated.id)
      .eq('user_id', user.id);

    // 3. Re-verify
    fetchData();
    if (error) console.error("Deduction update failed:", error.message);
  };

  const deleteDeduction = async (id: string) => {
    if (!user) return;

    // 1. Optimistic Update
    setDeductions(prev => prev.filter(d => d.id !== id));

    // 2. Background Sync
    const { error } = await supabase.from('deductions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    // 3. Re-verify
    fetchData();
    if (error) console.error("Deduction delete failed:", error.message);
  };

  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]
  );
  const totalExpense = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]
  );
  const balance = totalIncome - totalExpense;
  const taxResult = useMemo(() => calculateTax(totalIncome, deductions), [totalIncome, deductions]);

  if (authLoading || (dataLoading && transactions.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse font-medium">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">{t('appName')}</h1>
              <div className="flex items-center gap-1.5">
                {dataLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider animate-pulse">{t('syncing')}</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('syncActive')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
              <button
                onClick={() => setLanguage('th')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${language === 'th' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                TH
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
            </div>

            <ExportButton transactions={transactions} deductions={deductions} taxResult={taxResult} />
            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
            <div className="flex items-center gap-3 pl-1">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900">{user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-slate-400">{user?.email}</span>
              </div>
              <button
                onClick={signOut}
                className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition group"
                title={t('signOut')}
              >
                <LogOut className="w-5 h-5 group-active:scale-90 transition" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <SummaryDashboard totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} totalTax={taxResult.totalTax} />

        {/* Row 1: Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 h-[550px]">
            <ExpenseForm onAdd={addTransaction} />
          </div>

          <div className="lg:col-span-8 space-y-6 h-[550px] flex flex-col">
            {/* Sorting Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <ArrowUpDown className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{t('sortBy')}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'created_at', key: 'added', icon: Clock },
                  { id: 'date', key: 'sortDate', icon: Calendar },
                  { id: 'amount', key: 'sortAmount', icon: Coins },
                  { id: 'name', key: 'sortName', icon: Tag },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                      ${sortBy === option.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                  >
                    <option.icon className="w-3 h-3" />
                    {t(option.key)}
                  </button>
                ))}

                <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-black transition-all shadow-lg shadow-slate-900/10"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {sortOrder === 'asc' ? t('ascending') : t('descending')}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <ExpenseTable transactions={transactions} onUpdate={updateTransaction} onDelete={deleteTransaction} />
            </div>
          </div>
        </div>

        {/* Row 2: Analysis & Deductions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2 border-t border-slate-100">
          <div className="lg:col-span-4 min-h-[400px]">
            <DeductionManager
              deductions={deductions}
              onAdd={addDeduction}
              onUpdate={updateDeduction}
              onDelete={deleteDeduction}
            />
          </div>
          <div className="lg:col-span-8 min-h-[400px]">
            <TaxCalculator result={taxResult} />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs">
        &copy; 2024 {t('appName')} • Real-time Personal Income Tax Management
      </footer>

      {/* Floating Bottom Right Loading Indicator */}
      <div className={`fixed bottom-6 right-6 transition-all duration-500 z-50 ${dataLoading ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 border border-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="relative">
            <Cloud className="w-4 h-4 text-indigo-400" />
            <Loader2 className="w-4 h-4 text-white animate-spin absolute inset-0 opacity-50" />
          </div>
          <span className="text-xs font-bold tracking-tight">{t('syncing')}</span>
        </div>
      </div>
    </div>
  );
}
