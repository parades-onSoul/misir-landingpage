import React from "react"import React from "react"import React from "react"








































































}  )    </html>      </body>        <Analytics />        <Toaster position="top-center" theme="dark" />        {children}      <body className="font-sans antialiased">      </head>        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />      <head>    <html lang="en">  return (}>) {  children: React.ReactNode}: Readonly<{  children,export default function RootLayout({}  manifest: '/site.webmanifest',  },    apple: '/apple-touch-icon.png',    ],      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },    icon: [  icons: {  },    follow: true,    index: true,  robots: {  },    images: ['/og-image.png'],    description: 'Google Maps for your mind. Join the waitlist for the passive filter against information overload.',    title: 'Misir - The Anti-Noise Engine',    card: 'summary_large_image',  twitter: {  },    type: 'website',    locale: 'en_US',    ],      },        alt: 'Misir - The Anti-Noise Engine',        height: 630,        width: 1200,        url: '/og-image.png',      {    images: [    siteName: 'Misir',    url: 'https://misir.app',    description: 'Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed. Google Maps for your mind.',    title: 'Misir - The Anti-Noise Engine',  openGraph: {  metadataBase: new URL('https://misir.app'),  publisher: 'Misir',  creator: 'Misir',  authors: [{ name: 'Misir' }],  keywords: 'AI, noise filter, information management, knowledge management, productivity, deep work, waitlist',  description: 'Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed. Google Maps for your mind.',  title: 'Join the Waitlist | Misir - The Anti-Noise Engine',export const metadata: Metadata = {const _geistMono = Geist_Mono({ subsets: ["latin"] })const _geist = Geist({ subsets: ["latin"] })import './globals.css'import { Toaster } from 'sonner'import { Analytics } from '@vercel/analytics/next'import { Geist, Geist_Mono } from 'next/font/google'import type { Metadata } from 'next'







































































}  )    </html>      </body>        <Analytics />        <Toaster position="top-center" theme="dark" />        {children}      <body className="font-sans antialiased">      </head>        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />      <head>    <html lang="en">  return (}>) {  children: React.ReactNode}: Readonly<{  children,export default function RootLayout({}  manifest: '/site.webmanifest',  },    apple: '/apple-touch-icon.png',    ],      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },    icon: [  icons: {  },    follow: true,    index: true,  robots: {  },    images: ['/og-image.png'],    description: 'Google Maps for your mind. Join the waitlist for the passive filter against information overload.',    title: 'Misir - The Anti-Noise Engine',    card: 'summary_large_image',  twitter: {  },    type: 'website',    locale: 'en_US',    ],      },        alt: 'Misir - The Anti-Noise Engine',        height: 630,        width: 1200,        url: '/og-image.png',      {    images: [    siteName: 'Misir',    url: 'https://misir.app',    description: 'Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed. Google Maps for your mind.',    title: 'Misir - The Anti-Noise Engine',  openGraph: {  metadataBase: new URL('https://misir.app'),  publisher: 'Misir',  creator: 'Misir',  authors: [{ name: 'Misir' }],  keywords: 'AI, noise filter, information management, knowledge management, productivity, deep work, waitlist',  description: 'Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed. Google Maps for your mind.',  title: 'Join the Waitlist | Misir - The Anti-Noise Engine',export const metadata: Metadata = {const _geistMono = Geist_Mono({ subsets: ["latin"] });const _geist = Geist({ subsets: ["latin"] });import './globals.css'import { Toaster } from 'sonner'import { Analytics } from '@vercel/analytics/next'import { Geist, Geist_Mono } from 'next/font/google'import type { Metadata } from 'next'import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Join the Waitlist | Misir - The Anti-Noise Engine',
  description: 'Generative AI dropped the cost of text to zero. Misir is the passive filter for the flood that followed. Google Maps for your mind.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" theme="dark" />
        <Analytics />
      </body>
    </html>
  )
}


