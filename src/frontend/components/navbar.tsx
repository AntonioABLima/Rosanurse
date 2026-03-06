"use client"

import {
  FileText,
  LogOut,
  ChevronDown,
  Heart,
  Settings,
  HelpCircle,
  Palette,
  Sun,
  Moon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme, themes, type ThemeId } from "@/components/theme-provider"

type Screen = "resumo" | "settings" | "help"

interface NavbarProps {
  currentScreen: Screen | "result"
  onNavigate: (screen: Screen) => void
  onLogout: () => void
  userEmail?: string
}

export function Navbar({
  currentScreen,
  onNavigate,
  onLogout,
  userEmail = "usuario@email.com",
}: NavbarProps) {
  const { currentTheme, isDark, setTheme, toggleDark } = useTheme()

  const initials = userEmail
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase()

  const navItems: { label: string; screen: Screen; icon: React.ReactNode }[] = [
    {
      label: "Resumo",
      screen: "resumo",
      icon: <FileText className="size-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="size-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Rosanurse
          </span>
        </div>

        {/* Nav central */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navegacao principal">
          {navItems.map((item) => {
            const isActive =
              item.screen === currentScreen ||
              (item.screen === "resumo" && currentScreen === "result")
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu da conta"
            >
              <Avatar className="size-8 border border-border">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none text-foreground">Minha Conta</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onNavigate("resumo")}>
                <FileText className="size-4" />
                Resumo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("settings")}>
                <Settings className="size-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("help")}>
                <HelpCircle className="size-4" />
                Ajuda
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Swatches de cor */}
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Palette className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Cor</span>
              </div>
              <div className="flex gap-1.5">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    title={theme.label}
                    onClick={() => setTheme(theme.id as ThemeId)}
                    className={`size-7 rounded-full border-2 transition-all ${
                      currentTheme === theme.id
                        ? "border-foreground scale-110"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                ))}
              </div>
            </div>

            {/* Toggle dark/light */}
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="size-3.5 text-muted-foreground" /> : <Sun className="size-3.5 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground">{isDark ? "Escuro" : "Claro"}</span>
                </div>
                <button
                  onClick={toggleDark}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border ${
                    isDark ? "bg-primary border-primary" : "bg-background border-border"
                  }`}
                >
                  <span
                    className={`inline-block size-3.5 rounded-full shadow transition-transform ${
                      isDark ? "translate-x-4 bg-white" : "translate-x-0.5 bg-primary"
                    }`}
                  />
                </button>
              </div>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} variant="destructive">
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile nav */}
      <nav
        className="flex items-center gap-1 border-t border-border px-4 py-1.5 sm:hidden"
        aria-label="Navegacao mobile"
      >
        {navItems.map((item) => {
          const isActive =
            item.screen === currentScreen ||
            (item.screen === "resumo" && currentScreen === "result")
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
