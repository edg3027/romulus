import '../../styles/globals.css'

import { Metadata } from 'next'

import Layout from '../components/Layout'
import { ClientProviders } from './client-providers'

export const metadata: Metadata = {
  title: 'Romulus',
  description: 'Welcome to Romulus',
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <ClientProviders>
          <Layout>{children}</Layout>
        </ClientProviders>
      </body>
    </html>
  )
}
