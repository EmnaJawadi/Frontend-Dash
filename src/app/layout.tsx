import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { QueryProvider } from "@/src/providers/query-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";

export const metadata: Metadata = {
  title: "Centre de Support WhatsApp",
  description: "Interface de support client WhatsApp avec suivi des conversations et performances des agents.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="light">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
