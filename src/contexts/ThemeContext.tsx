import {
  useState,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'

type ThemeContext = {
  darkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: Props) => {
  const [darkMode, setDarkMode] = useState(
    window && window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  const toggleTheme = () => {
    setDarkMode((mode) => !mode)
  }

  useEffect(() => {
    if (document) {
      document.documentElement.classList.toggle('dark', darkMode)
    }
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = (): ThemeContext => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider!')
  }

  return context
}
