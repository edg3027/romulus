import '../../styles/globals.css'
import Layout from '../components/Layout'
import { getSessionWithAccount } from '../server/session'
import { ClientProviders } from './client-providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Romulus',
  description: 'Welcome to Romulus',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { account } = await getSessionWithAccount()

  return (
    <html lang='en' className={account?.darkMode ? 'dark' : undefined}>
      <body>
        <ClientProviders>
          <Layout>{children}</Layout>
        </ClientProviders>
      </body>
    </html>
  )
}
