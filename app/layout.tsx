import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "sonner";
import Hero from "@/components/hero";
import { ThemeProvider } from "next-themes";

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
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class">
          <Hero>{children}</Hero>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}