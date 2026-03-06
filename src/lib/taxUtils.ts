import { Deduction, TaxBracket, TaxResult } from "@/types";

const TAX_BRACKETS: { min: number; max: number; rate: number }[] = [
  { min: 0, max: 150_000, rate: 0 },
  { min: 150_000, max: 300_000, rate: 0.05 },
  { min: 300_000, max: 500_000, rate: 0.10 },
  { min: 500_000, max: 750_000, rate: 0.15 },
  { min: 750_000, max: 1_000_000, rate: 0.20 },
  { min: 1_000_000, max: 2_000_000, rate: 0.25 },
  { min: 2_000_000, max: 5_000_000, rate: 0.30 },
  { min: 5_000_000, max: Infinity, rate: 0.35 },
];

const PERSONAL_DEDUCTION = 60_000;
const MAX_EXPENSE_DEDUCTION = 100_000;
const EXPENSE_DEDUCTION_RATE = 0.5;

export function calculateTax(
  grossIncome: number,
  customDeductions: Deduction[]
): TaxResult {
  // 1) Expense deduction: 50% of income, capped at 100,000
  const expenseDeduction = Math.min(
    grossIncome * EXPENSE_DEDUCTION_RATE,
    MAX_EXPENSE_DEDUCTION
  );

  // 2) Personal deduction: 60,000
  const personalDeduction = PERSONAL_DEDUCTION;

  // 3) Custom deductions from user
  const customDeductionTotal = customDeductions.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  const totalDeductions =
    expenseDeduction + personalDeduction + customDeductionTotal;

  // 4) Net income
  const netIncome = Math.max(grossIncome - totalDeductions, 0);

  // 5) Progressive tax
  let remaining = netIncome;
  const brackets: TaxBracket[] = TAX_BRACKETS.map((b) => {
    const width = b.max === Infinity ? remaining : b.max - b.min;
    const taxable = Math.max(Math.min(remaining, width), 0);
    remaining -= taxable;
    return {
      min: b.min,
      max: b.max,
      rate: b.rate,
      taxAmount: taxable * b.rate,
    };
  });

  const totalTax = brackets.reduce((sum, b) => sum + b.taxAmount, 0);

  return {
    grossIncome,
    expenseDeduction,
    personalDeduction,
    customDeductions: customDeductionTotal,
    totalDeductions,
    netIncome,
    brackets,
    totalTax,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatBracketRange(min: number, max: number): string {
  if (max === Infinity) return `${formatCurrency(min)}+`;
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}
