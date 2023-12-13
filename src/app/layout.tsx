import '../../styles/globals.css'
import Navbar from '../components/Navbar'
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
          <ClientProviders>
            <Navbar />
            <div className='min-h-0 flex-1 overflow-auto'>{children}</div>
            <Toaster />
          </ClientProviders>
        </div>
      </body>
    </html>
  )
}
