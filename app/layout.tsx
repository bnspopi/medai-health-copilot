import type { Metadata } from 'next'
import { AuthProvider } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedAI Health Copilot',
  description: 'AI-powered multimodal healthcare assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
