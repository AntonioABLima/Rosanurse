"use client"

import { useState } from "react"
import { ClipboardCheck, FileText, RotateCcw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme, themes } from "@/components/theme-provider"

interface ResultPageProps {
  text: string
  onReset: () => void
}

export function ResultPage({ text, onReset }: ResultPageProps) {
  const [copied, setCopied] = useState(false)
  const { isDark, currentTheme } = useTheme()

  const theme = themes.find((t) => t.id === currentTheme)!
  const primary = isDark ? theme.darkColors.primary : theme.colors.primary
  const cursorColor = isDark ? "%23FFFFFF" : primary.replace("#", "%23")
  const cursorSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='18' viewBox='0 0 14 18' shape-rendering='crispEdges'%3E%3Cline x1='4' y1='1' x2='10' y2='1' stroke='${cursorColor}' stroke-width='2'/%3E%3Cline x1='7' y1='1' x2='7' y2='17' stroke='${cursorColor}' stroke-width='2'/%3E%3Cline x1='4' y1='17' x2='10' y2='17' stroke='${cursorColor}' stroke-width='2'/%3E%3C/svg%3E") 7 9, text`

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <FileText className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Resultado
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O texto processado
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="relative">
            <textarea
              readOnly
              value={text}
              rows={12}
              style={{ cursor: cursorSvg }}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm leading-relaxed text-foreground focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Texto processado"
            />
            <button
              onClick={handleCopy}
              title="Copiar texto"
              className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Copiar texto"
            >
              {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={handleCopy}
              size="lg"
              className="w-full text-base font-semibold"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="size-5" />
                  Copiado!
                </>
              ) : (
                "Copiar texto"
              )}
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              className="w-full text-base font-semibold"
            >
              <RotateCcw className="size-4" />
              Processar outro texto
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
