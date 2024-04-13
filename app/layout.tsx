import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "sonner";
import Hero from "@/components/hero";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { ModalProvider } from "@/providers/modal-provider";

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
      <body className={`${GeistSans.className} selection:bg-purple-700 selection:text-white`}>
        <ThemeProvider attribute="class" storageKey="theme">
          <Analytics />
          <Hero>{children}</Hero>
          <Toaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
