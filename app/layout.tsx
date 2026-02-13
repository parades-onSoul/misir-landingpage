import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    title: "Misir - The Anti-Noise Engine",
    description: "Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed.",
    url: "https://misir.com",
    siteName: "Misir",
    images: ["/Capture.PNG"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Misir - The Anti-Noise Engine",
    description: "Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed.",
    images: ["/Capture.PNG"],
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
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
