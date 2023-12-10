import Link from 'next/link'
import { FC, useCallback } from 'react'

import { useLogoutMutation, useSession } from '../services/auth'

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
    []
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

    return 'Loading...'
  }, [logout, renderLoginLinks, session.account, session.error])

  return (
    <div className='flex justify-between border-b border-gray-300 p-2 px-4'>
      <div className='flex space-x-2'>
        <Link href='/genres'>Tree</Link>
        <Link href='/genres/table'>Table</Link>
      </div>

      <div className='flex space-x-2'>{renderSession()}</div>
    </div>
  )
}

export default Navbar
