import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thumbify - AI Thumbnail Maker for YouTube',
  description: 'Create stunning YouTube thumbnails in seconds with AI. Free to start.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <nav className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Thumbify
            </a>
            <div className="flex items-center gap-6">
              <a href="/generate" className="text-gray-300 hover:text-white transition">Generate</a>
              <a href="/pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/api/auth/signin" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
                Sign In
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
