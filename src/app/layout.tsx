import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { ApiLoaderProvider } from "@/context/ApiLoaderContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SmartPay | Buyer Dashboard",
  description: "SmartPay buyer dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RoleProvider>
          <ApiLoaderProvider>{children}</ApiLoaderProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
