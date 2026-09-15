import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ProgressProvider } from "@/hooks/use-progress";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SQL Coffee Playground",
  description:
    "Aprende SQL de forma interactiva con la base de datos de una cadena de cafeterías, tutoría progresiva y sandbox seguro.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1612" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider>
          <ProgressProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
