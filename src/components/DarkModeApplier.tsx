'use client'

import useAccountSettings from '../hooks/useAccountSettings'
import { useEffect } from 'react'

const DarkModeApplier = () => {
  const { darkMode } = useAccountSettings()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return null
}

export default DarkModeApplier
