import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { QueryProvider } from "@/src/providers/query-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { ToastProvider } from "@/src/contexts/toast-context";

export const metadata: Metadata = {
  title: "Centre de Support WhatsApp",
  description: "Interface de support client WhatsApp avec suivi des conversations et performances des agents.",
  icons: {
    icon: "/logopfe.png",
    shortcut: "/logopfe.png",
    apple: "/logopfe.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="light">
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
