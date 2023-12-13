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
    <div className='flex justify-between border-b border-gray-300 p-2 px-4 dark:border-gray-700'>
      <div className='flex space-x-2'>
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
