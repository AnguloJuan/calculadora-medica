import { ThemeProvider } from "@/components/theme-provider";
import Toast from "@/components/Toast";
import { META_THEME_COLORS } from "@/utils/config";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Calculadoras Médicas",
    template: "%s | CalcMed",
  },
  description: "Calculadoras médicas",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          {children}
          <Toast />
        </ThemeProvider>
      </body>
    </html>
  );
}