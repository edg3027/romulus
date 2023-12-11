import useAccountSettings from '../hooks/useAccountSettings'
import { RiMoonLine, RiSunLine } from 'react-icons/ri'

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useAccountSettings()

  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? <RiSunLine /> : <RiMoonLine />}
    </button>
  )
}

export default DarkModeToggle
