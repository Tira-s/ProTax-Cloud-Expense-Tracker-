"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "th" | "en";

interface TranslationDict {
  [key: string]: {
    th: string;
    en: string;
  };
}

const translations: TranslationDict = {
  // Common
  appName: { th: "ProTax Cloud", en: "ProTax Cloud" },
  syncActive: { th: "เชื่อมต่อคลาวด์แล้ว", en: "Sync Active" },
  syncing: { th: "กำลังซิงค์...", en: "Syncing..." },
  signOut: { th: "ออกจากระบบ", en: "Sign Out" },
  loading: { th: "กำลังเชื่อมต่อคลาวด์...", en: "Syncing with Cloud..." },

  // Dashboard Header
  export: { th: "ส่งออก Excel", en: "Export Excel" },

  // Summary
  summaryTitle: { th: "ภาพรวมการเงิน", en: "Financial Summary" },
  totalIncome: { th: "รายรับทั้งหมด", en: "Total Income" },
  totalExpense: { th: "รายจ่ายทั้งหมด", en: "Total Expense" },
  balance: { th: "เงินคงเหลือ", en: "Balance" },
  estimatedTax: { th: "ภาษีที่ต้องจ่าย (ประมาณ)", en: "Estimated Tax" },

  // Expense Form
  addTransaction: { th: "เพิ่มรายการใหม่", en: "Add Transaction" },
  title: { th: "ชื่อรายการ", en: "Title" },
  placeholderTitle: { th: "เช่น เงินเดือน, ค่าอาหาร", en: "e.g. Salary, Food" },
  amount: { th: "จำนวนเงิน", en: "Amount" },
  category: { th: "หมวดหมู่", en: "Category" },
  type: { th: "ประเภท", en: "Type" },
  income: { th: "รายรับ", en: "Income" },
  expense: { th: "รายจ่าย", en: "Expense" },
  date: { th: "วันที่", en: "Date" },
  syncToCloud: { th: "บันทึกลงคลาวด์", en: "Sync to Cloud" },

  // Categories
  salary: { th: "เงินเดือน", en: "Salary" },
  freelance: { th: "ฟรีแลนซ์", en: "Freelance" },
  investment: { th: "การลงทุน", en: "Investment" },
  food: { th: "อาหาร", en: "Food" },
  travel: { th: "เดินทาง", en: "Travel" },
  housing: { th: "ที่พักอาศัย", en: "Housing" },
  health: { th: "สุขภาพ", en: "Health" },
  other: { th: "อื่นๆ", en: "Other" },

  // Deduction Manager
  manualDeductions: { th: "รายการลดหย่อนพิเศษ", en: "Manual Deductions" },
  totalCustom: { th: "รวมลดหย่อนพิเศษ", en: "Total Custom" },
  deductionName: { th: "ชื่อรายการลดหย่อน", en: "Deduction Name" },

  // Tax Calculator
  taxReport: { th: "รายงานภาษีเงินได้บุคคลธรรมดา", en: "Personal Income Tax Report" },
  taxableIncome: { th: "เงินได้สุทธิ", en: "Taxable Income" },
  logicReport: { th: "Logic Report", en: "Logic Report" },
  taxBreakdown: { th: "รายละเอียดภาษี", en: "Tax Breakdown" },
  bracket: { th: "ช่วงเงินได้", en: "Bracket" },
  rate: { th: "อัตราภาษี", en: "Rate" },
  taxAmount: { th: "ภาษี", en: "Tax" },
  standardDeduction: { th: "หักลดหย่อนพื้นฐาน", en: "Standard Deduction" },
  personalAllowance: { th: "ลดหย่อนส่วนตัว", en: "Personal Allowance" },
  totalManualDeduction: { th: "รวมรายการลดหย่อนพิเศษ", en: "Total Manual Deduction" },
  more: { th: "ขึ้นไป", en: "Up" },

  // Sorting
  sortBy: { th: "เรียงลำดับตาม", en: "Sort By" },
  added: { th: "ที่เพิ่มล่าสุด", en: "Added" },
  sortDate: { th: "วันที่", en: "Date" },
  sortAmount: { th: "จำนวนเงิน", en: "Amount" },
  sortName: { th: "ชื่อรายการ", en: "Name" },
  ascending: { th: "น้อยไปมาก", en: "Ascending" },
  descending: { th: "มากไปน้อย", en: "Descending" },

  // Calculator
  logicCalc: { th: "เครื่องคิดเลข", en: "Logic Calc" },
  useValue: { th: "ตกลง", en: "Use Value" },

  // Export Headers
  exportHeaderName: { th: "รายการ", en: "Item" },
  exportHeaderAmount: { th: "จำนวนเงิน", en: "Amount" },
  exportHeaderDate: { th: "วันที่", en: "Date" },

  // Expense Table
  noRecords: { th: "ยังไม่มีข้อมูลในคลาวด์", en: "No cloud records found" },
  startAdding: { th: "เริ่มต้นด้วยการเพิ่มรายการแรกของคุณ", en: "Start by adding your first transaction." },
  cloudLedger: { th: "บัญชีคลาวด์", en: "Cloud Ledger" },
  entries: { th: "รายการ", en: "Entries" },
  statusDate: { th: "สถานะ / วันที่", en: "Status / Date" },
  description: { th: "รายละเอียด", en: "Description" },
  action: { th: "จัดการ", en: "Action" },
  item: { th: "รายการ", en: "Item" },

  // Auth
  signInTitle: { th: "ลงชื่อเข้าใช้ ProTax Cloud", en: "Sign in to ProTax Cloud" },
  signInSubtitle: { th: "เข้าสู่ระบบเพื่อจัดการภาษีอย่างปลอดภัย", en: "Sign in to manage your taxes securely" },
  emailLabel: { th: "อีเมล", en: "Email address" },
  passwordLabel: { th: "รหัสผ่าน", en: "Password" },
  signInBtn: { th: "เข้าสู่ระบบ", en: "Sign in" },
  noAccount: { th: "ยังไม่มีบัญชีใช่ไหม?", en: "Don't have an account?" },
  signUpLink: { th: "สมัครสมาชิก", en: "Sign up" },
  signUpTitle: { th: "เริ่มใช้งาน ProTax Cloud", en: "Get started with ProTax Cloud" },
  signUpSubtitle: { th: "สร้างบัญชีเพื่อเริ่มซิงค์ข้อมูลภาษี", en: "Create your account to start syncing tax data" },
  alreadyHaveAccount: { th: "มีบัญชีอยู่แล้วใช่ไหม?", en: "Already have an account?" },
  loginLink: { th: "เข้าสู่ระบบ", en: "Log in" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("th");

  useEffect(() => {
    const saved = localStorage.getItem("protax-lang") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("protax-lang", lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
