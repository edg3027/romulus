'use client'

import useAccountSettings from '../hooks/useAccountSettings'
import Button from './common/Button'
import { RiMoonLine, RiSunLine } from 'react-icons/ri'

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useAccountSettings()

  return (
    <Button
      template='tertiary'
      className='flex w-full items-center justify-start gap-1.5 text-gray-600 dark:text-gray-300'
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <RiMoonLine /> : <RiSunLine />}
      <div>{darkMode ? 'Dark Mode' : 'Light Mode'}</div>
    </Button>
  )
}

export default DarkModeToggle
