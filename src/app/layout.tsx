import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextUIProvider } from '@nextui-org/react';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Card Read',
  description: 'a program for to read the user card info ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextUIProvider>
        {children}
        </NextUIProvider>
        </body>
    </html>
  )
}
