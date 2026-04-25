import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from 'next'
import './globals.css'
import Provider from './provider'
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"

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
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body">
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
