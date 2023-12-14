import '../../styles/globals.css'
import DarkModeApplier from '../components/DarkModeApplier'
import Navbar from '../components/Navbar'
import { ServerAccountProvider } from '../hooks/useServerAccount'
import { getSessionWithAccount } from '../server/session'
import { ClientProviders } from './client-providers'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

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
        <div className='flex h-screen w-screen flex-col'>
          <ServerAccountProvider account={account}>
            <ClientProviders>
              <Navbar />
              <div className='min-h-0 flex-1 overflow-auto'>{children}</div>
              <Toaster />
              <DarkModeApplier />
            </ClientProviders>
          </ServerAccountProvider>
        </div>
      </body>
    </html>
  )
}
