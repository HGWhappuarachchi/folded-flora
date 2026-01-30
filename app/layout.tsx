import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Folded Flora - Handmade Paper Flowers',
    description: 'Beautiful handmade paper flowers for every occasion. Browse our unique collection of bouquets, gift boxes, and decorations.',
    keywords: 'paper flowers, handmade flowers, bouquets, gift boxes, decorations',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
