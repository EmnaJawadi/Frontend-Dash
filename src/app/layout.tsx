import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { QueryProvider } from "@/src/providers/query-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";

export const metadata: Metadata = {
  title: "WhatsApp Support Dashboard",
  description: "Dashboard support WhatsApp avec agent IA",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}