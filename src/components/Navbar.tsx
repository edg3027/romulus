'use client'

import { useLogoutMutation, useSession } from '../services/auth'
import DarkModeToggle from './DarkModeToggle'
import Loader from './common/Loader'
import Link from 'next/link'
import { FC, useCallback } from 'react'

const Navbar: FC = () => {
  const session = useSession()

  const { mutate: logout } = useLogoutMutation()

  const renderLoginLinks = useCallback(
    () => (
      <>
        <Link href='/login'>Log in</Link>
        <Link href='/register'>Register</Link>
      </>
    ),
    [],
  )

  const renderSession = useCallback(() => {
    if (session.account !== undefined) {
      return session.account ? (
        <>
          <Link href={`/accounts/${session.account.id}`}>
            {session.account.username}
          </Link>
          <button onClick={() => logout()}>Log out</button>
        </>
      ) : (
        renderLoginLinks()
      )
    }

    if (session.error) {
      return renderLoginLinks()
    }

    return <Loader size={16} />
  }, [logout, renderLoginLinks, session.account, session.error])

  return (
    <div className='flex justify-between p-2'>
      <div className='flex gap-3 rounded-lg border border-gray-200 bg-gray-100 p-2 px-3 text-sm font-bold tracking-wide text-gray-600 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'>
        <Link href='/genres'>Tree</Link>
        <Link href='/genres/table'>Table</Link>
      </div>

      <div className='flex items-center gap-2'>
        {renderSession()}
        <DarkModeToggle />
      </div>
    </div>
  )
}

export default Navbar
