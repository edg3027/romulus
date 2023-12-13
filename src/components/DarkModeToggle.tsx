'use client'

import useAccountSettings from '../hooks/useAccountSettings'
import Tooltip from './common/Tooltip'
import { useEffect } from 'react'
import { RiMoonLine, RiSunLine } from 'react-icons/ri'

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useAccountSettings()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Tooltip
      tip={darkMode ? 'Use light mode' : 'Use dark mode'}
      className='flex'
    >
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <RiMoonLine /> : <RiSunLine />}
      </button>
    </Tooltip>
  )
}

export default DarkModeToggle
