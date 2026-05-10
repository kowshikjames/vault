import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'VAULT — Dress Beyond Ordinary',
  description:
    'Curated thrifted clothing, premium sneakers, and exclusive accessories. VAULT is an Instagram-native fashion boutique.',
  keywords: ['thrift', 'sneakers', 'streetwear', 'fashion', 'VAULT'],
  openGraph: {
    title: 'VAULT — Dress Beyond Ordinary',
    description: 'Curated thrift finds, rare sneakers, and luxury accessories.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Nav />
        <CartDrawer />
        <main style={{ paddingTop: 64 }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
