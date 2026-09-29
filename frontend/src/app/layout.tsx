import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payodhi · NTRO IPsec Analyzer · SIH 26160",
  description: "AI-Powered IPsec VPN Protocol Analyzer & Quantum Security Assessment Framework",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-cyan-500 selection:text-black">
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] min-h-screen relative">{children}</main>
      </body>
    </html>
  );
}
