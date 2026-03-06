"use client"

import { Check } from "lucide-react"
import { useTheme, themes, type ThemeId } from "@/components/theme-provider"

export function ThemePicker() {
  const { currentTheme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => {
        const isActive = currentTheme === theme.id
        return (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id as ThemeId)}
            className={`group relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
              isActive
                ? "border-primary shadow-md"
                : "border-transparent bg-background hover:border-accent"
            }`}
            style={{ backgroundColor: theme.preview.bg }}
            aria-label={`Tema ${theme.label}`}
            aria-pressed={isActive}
          >
            {/* Color preview swatches */}
            <div className="flex items-center gap-1.5">
              <span
                className="size-5 rounded-full border border-black/5"
                style={{ backgroundColor: theme.preview.card }}
              />
              <span
                className="size-5 rounded-full border border-black/5"
                style={{ backgroundColor: theme.preview.accent }}
              />
              <span
                className="size-5 rounded-full border border-black/5"
                style={{ backgroundColor: theme.preview.primary }}
              />
            </div>

            {/* Label + description */}
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: theme.colors.foreground }}
              >
                {theme.label}
              </p>
              <p
                className="mt-0.5 text-xs leading-relaxed"
                style={{ color: theme.colors.mutedForeground }}
              >
                {theme.description}
              </p>
            </div>

            {/* Active indicator */}
            {isActive && (
              <span
                className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full"
                style={{ backgroundColor: theme.preview.primary }}
              >
                <Check className="size-3 text-white" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
