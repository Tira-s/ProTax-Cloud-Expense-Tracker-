# ProTax Cloud - Smart Tax Tracker

ProTax Cloud is a modern, premium financial management application designed to help users track expenses, manage income, and automatically calculate tax liabilities. Built with speed and security in mind, it provides a seamless experience for both personal and professional tax planning.

## 🚀 Features

- **Intuitive Dashboard**: Real-time summary of your financial health, including total income, expenses, and estimated tax.
- **Expense & Income Tracking**: Easily record and categorize every transaction with optimistic UI updates.
- **Automatic Tax Calculation**: Built-in logic to estimate taxes based on current regulations.
- **Deduction Management**: Track and apply tax deductions to optimize your tax position.
- **Secure Authentication**: Robust session management powered by **Supabase SSR**.
- **Edge Security**: Custom **Proxy (Middleware)** layer for route protection and strict Content Security Policy (CSP).
- **Data Export**: Export your financial data to Excel (.xlsx) for external reporting.
- **Responsive Design**: Premium UI built with Tailwind CSS, optimized for all devices.
- **Internationalization**: Full support for multiple languages including Thai and English.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/) with `@supabase/ssr`
- **Security**: Next.js Proxy (Edge Middleware) with CSP headers
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
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🔐 Security Measures

This application implements several production-grade security measures:
- **Route Protection**: All `/dashboard` routes are protected at the Edge via `src/proxy.ts`.
- **CSP**: Strict Content Security Policy to prevent XSS and data injection.
- **SSR Cookies**: Secure, server-side session handling to prevent session theft.
- **Input Sanitization**: Client and server-side validation of all financial data.

## 📄 License

This project is private and proprietary.
