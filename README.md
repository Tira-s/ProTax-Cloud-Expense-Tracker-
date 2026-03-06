# ProTax Cloud - Smart Tax Tracker

ProTax Cloud is a modern, web-based financial management application designed to help users track expenses, manage income, and automatically calculate tax liabilities. Built with speed and security in mind, it provides a seamless experience for both personal and professional tax planning.

## 🚀 Features

- **Intuitive Dashboard**: Real-time summary of your financial health, including total income, expenses, and estimated tax.
- **Expense & Income Tracking**: Easily record and categorize every transaction.
- **Automatic Tax Calculation**: Built-in logic to estimate taxes based on current regulations.
- **Deduction Management**: Track and apply tax deductions to optimize your tax position.
- **Secure Authentication**: Robust user sign-up and login powered by Supabase.
- **Data Export**: Export your financial data to Excel (.xlsx) for external reporting or record-keeping.
- **Responsive Design**: Fully optimized for both desktop and mobile devices using Tailwind CSS.
- **Internationalization**: Support for multiple languages.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Excel Export**: [SheetJS (xlsx)](https://sheetjs.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ProTax-Cloud-Expense-Tracker-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

This project is private and proprietary.
