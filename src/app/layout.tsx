import '../../styles/globals.css'
import Layout from '../components/Layout'
import { ClientProviders } from './client-providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Romulus',
  description: 'Welcome to Romulus',
}

export default function RootLayout({
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
