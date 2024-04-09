import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Hero from "@/components/hero";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "athena",
  description: "generate. visualize. interact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Hero>{children}</Hero>
        <Toaster />
      </body>
    </html>
  );
}
