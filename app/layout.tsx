import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { ModalProvider } from "@/providers/modal-provider";
import Header from "@/components/header";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: "athena",
  description: "graph of knowledge. made by you.",
  metadataBase: new URL("https://athena-graph.vercel.app/"),
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistMono.className} selection:bg-purple-700 selection:text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" storageKey="theme">
          <Analytics />
          <Header />
          {children}
          <Toaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
