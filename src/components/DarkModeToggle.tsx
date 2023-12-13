'use client'

import useAccountSettings from '../hooks/useAccountSettings'
import { useEffect } from 'react'
import { RiMoonLine, RiSunLine } from 'react-icons/ri'

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useAccountSettings()
  console.log({ darkMode })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? <RiSunLine /> : <RiMoonLine />}
    </button>
  )
}

export default DarkModeToggle
