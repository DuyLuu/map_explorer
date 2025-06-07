import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Theme, DarkTheme, ThemeMode, ThemeModeConfig } from './constants'
import { getTheme } from './utils'

// Theme context type
interface ThemeContextType {
  theme: typeof Theme
  mode: ThemeMode
  isDark: boolean
  modeConfig: ThemeModeConfig
  setMode: (mode: ThemeModeConfig) => void
  toggleTheme: () => void
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode
  defaultMode?: ThemeModeConfig
  storageKey?: string
}

// Storage key for persisting theme preference
const THEME_STORAGE_KEY = '@app_theme_mode'

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  storageKey = THEME_STORAGE_KEY,
}) => {
  const systemColorScheme = useColorScheme()
  const [modeConfig, setModeConfig] = useState<ThemeModeConfig>(defaultMode)
  const [isLoading, setIsLoading] = useState(true)

  // Determine actual theme mode based on config
  const getActualMode = (config: ThemeModeConfig): ThemeMode => {
    if (config === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light'
    }
    return config
  }

  const mode = getActualMode(modeConfig)
  const isDark = mode === 'dark'
  const theme = getTheme(mode)

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(storageKey)
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setModeConfig(savedMode as ThemeModeConfig)
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [storageKey])

  // Save theme preference
  const setMode = async (newMode: ThemeModeConfig) => {
    try {
      setModeConfig(newMode)
      await AsyncStorage.setItem(storageKey, newMode)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark'
    setMode(newMode)
  }

  // Don't render children while loading theme preference
  if (isLoading) {
    return null
  }

  const contextValue: ThemeContextType = {
    theme,
    mode,
    isDark,
    modeConfig,
    setMode,
    toggleTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// Utility hook for theme-aware styles
export const useThemedStyles = <T extends Record<string, any>>(
  createStyles: (theme: typeof Theme) => T
): T => {
  const { theme } = useTheme()
  return createStyles(theme)
}

// HOC for theme-aware components
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: typeof Theme; isDark: boolean }>
) => {
  const WrappedComponent = (props: P) => {
    const { theme, isDark } = useTheme()
    return <Component {...props} theme={theme} isDark={isDark} />
  }

  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Hook for responsive values based on breakpoints
export const useResponsiveValue = <T,>(values: { base: T; sm?: T; md?: T; lg?: T }) => {
  const { theme } = useTheme()
  const screenWidth = theme.breakpoints.phone // You might want to get actual screen width here

  // This is a simplified implementation
  // In a real app, you'd want to listen to screen size changes
  if (screenWidth >= theme.breakpoints.tablet) {
    return values.lg || values.md || values.sm || values.base
  }
  if (screenWidth >= theme.breakpoints.phone) {
    return values.md || values.sm || values.base
  }

  return values.sm || values.base
}

// Hook for system theme detection
export const useSystemTheme = (): ThemeMode => {
  const systemColorScheme = useColorScheme()
  return systemColorScheme === 'dark' ? 'dark' : 'light'
}

// Status bar style helper
export const useStatusBarStyle = (): 'light-content' | 'dark-content' => {
  const { isDark } = useTheme()
  return isDark ? 'light-content' : 'dark-content'
}

export default ThemeContext
