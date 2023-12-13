import Navbar from './Navbar'
import { FC, PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex h-screen w-screen flex-col'>
      <Navbar />

      <div className='min-h-0 flex-1 overflow-auto'>{children}</div>

      <Toaster />
    </div>
  )
}

export default Layout
