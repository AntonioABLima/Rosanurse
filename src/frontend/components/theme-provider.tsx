"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

export type ThemeId = "rosa-suave" | "menta-clinica" | "ambar-saude" | "terracota"

interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export interface ThemeOption {
  id: ThemeId
  label: string
  description: string
  preview: { bg: string; card: string; accent: string; primary: string }
  colors: ThemeColors
  darkColors: ThemeColors
}

export const themes: ThemeOption[] = [
  {
    id: "rosa-suave",
    label: "Rosa Suave",
    description: "Tons rosados acolhedores e calorosos",
    preview: { bg: "#FFFBF1", card: "#FFF2D0", accent: "#FFB2B2", primary: "#E36A6A" },
    colors: {
      background: "#FFFBF1",
      foreground: "#3D2C2C",
      card: "#FFF2D0",
      cardForeground: "#3D2C2C",
      popover: "#FFF2D0",
      popoverForeground: "#3D2C2C",
      primary: "#E36A6A",
      primaryForeground: "#FFFFFF",
      secondary: "#FFF2D0",
      secondaryForeground: "#3D2C2C",
      muted: "#FFF2D0",
      mutedForeground: "#7A6060",
      accent: "#FFB2B2",
      accentForeground: "#3D2C2C",
      destructive: "#E36A6A",
      destructiveForeground: "#FFFFFF",
      border: "#FFB2B2",
      input: "#FFB2B2",
      ring: "#E36A6A",
    },
    darkColors: {
      background: "#1C1212",
      foreground: "#F5E8E8",
      card: "#2A1A1A",
      cardForeground: "#F5E8E8",
      popover: "#2A1A1A",
      popoverForeground: "#F5E8E8",
      primary: "#E36A6A",
      primaryForeground: "#FFFFFF",
      secondary: "#3A2020",
      secondaryForeground: "#F5E8E8",
      muted: "#3A2020",
      mutedForeground: "#A08080",
      accent: "#6B3030",
      accentForeground: "#F5E8E8",
      destructive: "#E36A6A",
      destructiveForeground: "#FFFFFF",
      border: "#4A2828",
      input: "#4A2828",
      ring: "#E36A6A",
    },
  },
  {
    id: "menta-clinica",
    label: "Menta Clinica",
    description: "Verde menta com ar profissional de saude",
    preview: { bg: "#F7FBF8", card: "#E2F0E6", accent: "#A3D4B3", primary: "#4A9B6E" },
    colors: {
      background: "#F7FBF8",
      foreground: "#2C3A30",
      card: "#E2F0E6",
      cardForeground: "#2C3A30",
      popover: "#E2F0E6",
      popoverForeground: "#2C3A30",
      primary: "#4A9B6E",
      primaryForeground: "#FFFFFF",
      secondary: "#E2F0E6",
      secondaryForeground: "#2C3A30",
      muted: "#E2F0E6",
      mutedForeground: "#5E7A66",
      accent: "#A3D4B3",
      accentForeground: "#2C3A30",
      destructive: "#D96B6B",
      destructiveForeground: "#FFFFFF",
      border: "#A3D4B3",
      input: "#A3D4B3",
      ring: "#4A9B6E",
    },
    darkColors: {
      background: "#121C14",
      foreground: "#E8F5EB",
      card: "#1A2A1C",
      cardForeground: "#E8F5EB",
      popover: "#1A2A1C",
      popoverForeground: "#E8F5EB",
      primary: "#4A9B6E",
      primaryForeground: "#FFFFFF",
      secondary: "#1E3020",
      secondaryForeground: "#E8F5EB",
      muted: "#1E3020",
      mutedForeground: "#7AAA88",
      accent: "#2A4A30",
      accentForeground: "#E8F5EB",
      destructive: "#D96B6B",
      destructiveForeground: "#FFFFFF",
      border: "#2A4030",
      input: "#2A4030",
      ring: "#4A9B6E",
    },
  },
  {
    id: "ambar-saude",
    label: "Ambar Saude",
    description: "Dourado quente com energia acolhedora",
    preview: { bg: "#FFFCF5", card: "#FFF0D4", accent: "#F0C96E", primary: "#C8892E" },
    colors: {
      background: "#FFFCF5",
      foreground: "#3A3020",
      card: "#FFF0D4",
      cardForeground: "#3A3020",
      popover: "#FFF0D4",
      popoverForeground: "#3A3020",
      primary: "#C8892E",
      primaryForeground: "#FFFFFF",
      secondary: "#FFF0D4",
      secondaryForeground: "#3A3020",
      muted: "#FFF0D4",
      mutedForeground: "#7A6A50",
      accent: "#F0C96E",
      accentForeground: "#3A3020",
      destructive: "#D96B6B",
      destructiveForeground: "#FFFFFF",
      border: "#F0C96E",
      input: "#F0C96E",
      ring: "#C8892E",
    },
    darkColors: {
      background: "#1C1810",
      foreground: "#F5F0E0",
      card: "#2A2014",
      cardForeground: "#F5F0E0",
      popover: "#2A2014",
      popoverForeground: "#F5F0E0",
      primary: "#C8892E",
      primaryForeground: "#FFFFFF",
      secondary: "#3A2C18",
      secondaryForeground: "#F5F0E0",
      muted: "#3A2C18",
      mutedForeground: "#AA9060",
      accent: "#5A3E18",
      accentForeground: "#F5F0E0",
      destructive: "#D96B6B",
      destructiveForeground: "#FFFFFF",
      border: "#4A3820",
      input: "#4A3820",
      ring: "#C8892E",
    },
  },
  {
    id: "terracota",
    label: "Terracota",
    description: "Tons terrosos naturais e reconfortantes",
    preview: { bg: "#FDF8F4", card: "#F2E2D4", accent: "#D4A98A", primary: "#B5694D" },
    colors: {
      background: "#FDF8F4",
      foreground: "#3A2E28",
      card: "#F2E2D4",
      cardForeground: "#3A2E28",
      popover: "#F2E2D4",
      popoverForeground: "#3A2E28",
      primary: "#B5694D",
      primaryForeground: "#FFFFFF",
      secondary: "#F2E2D4",
      secondaryForeground: "#3A2E28",
      muted: "#F2E2D4",
      mutedForeground: "#7A6558",
      accent: "#D4A98A",
      accentForeground: "#3A2E28",
      destructive: "#D96B6B",
      destructiveForeground: "#FFFFFF",
      border: "#D4A98A",
      input: "#D4A98A",
      ring: "#B5694D",
    },
    darkColors: {
      background: "#1C1410",
      foreground: "#F5EDE5",
      card: "#2A1E16",
      cardForeground: "#F5EDE5",
      popover: "#2A1E16",
      popoverForeground: "#F5EDE5",
      primary: "#B5694D",
      primaryForeground: "#FFFFFF",
      secondary: "#3A2820",
      secondaryForeground: "#F5EDE5",
      muted: "#3A2820",
      mutedForeground: "#AA8870",
      accent: "#5A3828",
      accentForeground: "#F5EDE5",
      destructive: "#D96B6B",
      destructiveForeground: "#FFFFFF",
      border: "#4A2E22",
      input: "#4A2E22",
      ring: "#B5694D",
    },
  },
]

interface ThemeContextValue {
  currentTheme: ThemeId
  isDark: boolean
  setTheme: (id: ThemeId) => void
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: "rosa-suave",
  isDark: false,
  setTheme: () => {},
  toggleDark: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

const CSS_PROP_MAP: Record<keyof ThemeColors, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
}

function applyTheme(theme: ThemeOption, dark: boolean) {
  const colors = dark ? theme.darkColors : theme.colors
  const root = document.documentElement
  for (const [key, prop] of Object.entries(CSS_PROP_MAP)) {
    root.style.setProperty(prop, colors[key as keyof ThemeColors])
  }
  root.style.setProperty("--sidebar", colors.card)
  root.style.setProperty("--sidebar-foreground", colors.foreground)
  root.style.setProperty("--sidebar-primary", colors.primary)
  root.style.setProperty("--sidebar-primary-foreground", colors.primaryForeground)
  root.style.setProperty("--sidebar-accent", colors.accent)
  root.style.setProperty("--sidebar-accent-foreground", colors.accentForeground)
  root.style.setProperty("--sidebar-border", colors.border)
  root.style.setProperty("--sidebar-ring", colors.ring)
}

const STORAGE_KEY = "rosanurse-theme"
const STORAGE_DARK_KEY = "rosanurse-dark"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("rosa-suave")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null
      const savedDark = window.localStorage.getItem(STORAGE_DARK_KEY) === "true"
      const themeId = savedTheme && themes.find((t) => t.id === savedTheme) ? savedTheme : "rosa-suave"
      setCurrentTheme(themeId)
      setIsDark(savedDark)
      const theme = themes.find((t) => t.id === themeId)!
      applyTheme(theme, savedDark)
    } catch {
      // localStorage not available
    }
    setMounted(true)
  }, [])

  const setTheme = useCallback((id: ThemeId) => {
    const theme = themes.find((t) => t.id === id)
    if (!theme) return
    setCurrentTheme(id)
    setIsDark((dark) => {
      applyTheme(theme, dark)
      return dark
    })
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch { /* empty */ }
  }, [])

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      setCurrentTheme((id) => {
        const theme = themes.find((t) => t.id === id)!
        applyTheme(theme, next)
        return id
      })
      try {
        window.localStorage.setItem(STORAGE_DARK_KEY, String(next))
      } catch { /* empty */ }
      return next
    })
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ currentTheme, isDark, setTheme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
