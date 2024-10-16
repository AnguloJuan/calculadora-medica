import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Toast from "./components/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full">
      <body className={`${inter.className} min-h-full`}>
        {children}
        <Toast />
      </body>
    </html>
  );
}
