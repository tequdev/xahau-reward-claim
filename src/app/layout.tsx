import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xahau Reward Claim',
  description: 'Claim rewards from Xahau Network and check the estimated amount of rewards.',
  metadataBase: new URL(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://claim-reward.tequ.dev'),
  openGraph: {
    type: 'website',
    url: 'https://claim-reward.tequ.dev',
    title: 'Xahau Reward Claim',
    description: 'Claim rewards from Xahau Network and check the estimated amount of rewards.',
    images: '/ogp.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Xahau Reward Claim",
    description: "Claim rewards from Xahau Network and check the estimated amount of rewards.",
    site: '@_tequ_',
    creator: '@_tequ_',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
