'use client'

import { useLogoutMutation, useSession } from '../services/auth'
import DarkModeButton from './DarkModeButton'
import Button from './common/Button'
import Loader from './common/Loader'
import Popover from './common/Popover'
import Link from 'next/link'
import { FC, useState } from 'react'
import {
  RiArrowDownSLine,
  RiLogoutBoxLine,
  RiProfileLine,
} from 'react-icons/ri'

const Navbar: FC = () => {
  return (
    <div className='flex justify-between p-2'>
      <div className='flex gap-3 rounded-lg border border-gray-200 bg-gray-100 p-2 px-3 text-sm font-bold tracking-wide text-gray-600 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'>
        <Link href='/genres'>Tree</Link>
        <Link href='/genres/table'>Table</Link>
      </div>

      <Session />
    </div>
  )
}

const Session = () => {
  const session = useSession()

  const { mutate: logout } = useLogoutMutation()

  const [open, setOpen] = useState(false)

  const renderContent = () => {
    if (session.account) {
      return (
        <Popover show={open}>
          <Popover.Target className='h-full w-full'>
            <button
              className='group/account-button h-full w-full p-1'
              onClick={() => setOpen(!open)}
            >
              <div className='flex h-full items-center gap-1 rounded px-2 pr-1 transition group-hover/account-button:bg-gray-200 dark:group-hover/account-button:bg-gray-800'>
                <div>{session.account.username}</div>
                <RiArrowDownSLine
                  size={18}
                  className='relative top-px text-gray-500 dark:text-gray-400'
                />
              </div>
            </button>
          </Popover.Target>

          <Popover.Content className='rounded-lg border border-gray-200 bg-gray-100 p-1 shadow dark:border-gray-800 dark:bg-gray-900'>
            <Link href={`/accounts/${session.account.id}`}>
              <Button
                template='tertiary'
                className='flex w-full items-center justify-start gap-1.5 text-gray-600 dark:text-gray-300'
              >
                <RiProfileLine />
                <div>Profile</div>
              </Button>
            </Link>
            <DarkModeButton />
            <Button
              template='tertiary'
              className='flex w-full items-center justify-start gap-1.5 text-gray-600 dark:text-gray-300'
              onClick={() => logout()}
            >
              <RiLogoutBoxLine />
              <div>Log out</div>
            </Button>
          </Popover.Content>
        </Popover>
      )
    }

    if (session.account === null || session.error) {
      return (
        <div className='flex h-full w-full items-center gap-3 p-2 px-3'>
          <Link href='/login'>Log in</Link>
          <Link href='/register'>Register</Link>
        </div>
      )
    }

    return <Loader size={16} />
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-gray-100 text-sm font-bold tracking-wide text-gray-600 transition dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'>
      {renderContent()}
    </div>
  )
}

export default Navbar
