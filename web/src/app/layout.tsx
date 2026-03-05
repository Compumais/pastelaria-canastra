import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"

import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/context/auth-context"
import { CashCloseProvider } from "@/context/cash-close-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pastelaria Canastra",
  icons: {
    icon: '/icon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <CashCloseProvider>
              <Toaster richColors />
              {children}
            </CashCloseProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
