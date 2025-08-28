import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Intuitus Ads',
  description: 'Digital Signage',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <main>
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </main>
      </body>
    </html>
  );
}
