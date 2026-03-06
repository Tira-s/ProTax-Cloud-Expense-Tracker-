import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProTax Cloud & Expense Tracker",
  description:
    "Professional cloud-synced expense tracking and Thai personal income tax management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50/50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
