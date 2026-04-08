import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './provider'
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Conduit CMS',
  description: 'A modern blog CMS built with Next.js, Convex & TipTap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
