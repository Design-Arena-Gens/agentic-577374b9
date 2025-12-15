import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChatPT Atlas - Geography Quiz',
  description: 'Test your geography knowledge with AI-powered questions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
