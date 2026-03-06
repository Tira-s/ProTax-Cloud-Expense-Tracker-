export interface Transaction {
  id: string;
  user_id?: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  date: string;
}

export interface Deduction {
  id: string;
  user_id?: string;
  name: string;
  amount: number;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  taxAmount: number;
}

export interface TaxResult {
  grossIncome: number;
  expenseDeduction: number;
  personalDeduction: number;
  customDeductions: number;
  totalDeductions: number;
  netIncome: number;
  brackets: TaxBracket[];
  totalTax: number;
}
