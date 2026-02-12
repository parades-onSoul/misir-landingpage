import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Misir - Join the Waitlist",
  description: "Be among the first to experience Misir. Join our exclusive waitlist and get early access to the future of AI-powered innovation.",
  keywords: ["misir", "waitlist", "AI", "innovation", "early access", "technology"],
  authors: [{ name: "Misir" }],
  openGraph: {
    title: "Misir - Join the Waitlist",
    description: "Be among the first to experience Misir. Join our exclusive waitlist and get early access to the future of AI-powered innovation.",
    url: "https://misir.com",
    siteName: "Misir",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Misir - Join the Waitlist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Misir - Join the Waitlist",
    description: "Be among the first to experience Misir. Join our exclusive waitlist and get early access to the future of AI-powered innovation.",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
