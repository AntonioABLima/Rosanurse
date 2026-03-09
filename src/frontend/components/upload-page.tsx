"use client"

import { useState } from "react"
import { ClipboardPaste, HelpCircle, Cpu, ClipboardCopy, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { processText } from "@/lib/text-processor"
import { useTheme, themes } from "@/components/theme-provider"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const steps = [
  {
    icon: <ClipboardPaste className="size-5 text-primary" />,
    title: "Cole o texto do PDF",
    description: "Abra o PDF, selecione todo o texto, copie e cole aqui.",
  },
  {
    icon: <Cpu className="size-5 text-primary" />,
    title: "Processe",
    description: 'Clique em "Processar" para organizar o texto automaticamente.',
  },
  {
    icon: <ClipboardCopy className="size-5 text-primary" />,
    title: "Copie para o sistema",
    description: "Revise o resultado e copie diretamente para o seu prontuário.",
  },
]

interface UploadPageProps {
  onProcessed: (text: string) => void
}

export function UploadPage({ onProcessed }: UploadPageProps) {
  const [pastedText, setPastedText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pasted, setPasted] = useState(false)
  const { isDark, currentTheme } = useTheme()

  const theme = themes.find((t) => t.id === currentTheme)!
  const primary = isDark ? theme.darkColors.primary : theme.colors.primary
  const cursorColor = isDark ? "%23FFFFFF" : primary.replace("#", "%23")
  const cursorSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='18' viewBox='0 0 14 18' shape-rendering='crispEdges'%3E%3Cline x1='4' y1='1' x2='10' y2='1' stroke='${cursorColor}' stroke-width='2'/%3E%3Cline x1='7' y1='1' x2='7' y2='17' stroke='${cursorColor}' stroke-width='2'/%3E%3Cline x1='4' y1='17' x2='10' y2='17' stroke='${cursorColor}' stroke-width='2'/%3E%3C/svg%3E") 7 9, text`

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setPastedText(text)
      setPasted(true)
      setTimeout(() => setPasted(false), 2000)
    } catch {
      // user denied clipboard permission — they can paste manually
    }
  }

  function handleProcess() {
    const trimmed = pastedText.trim()
    if (!trimmed) return
    setError(null)
    try {
      const result = processText(trimmed)
      if (!result) {
        setError("Não foi possível extrair exames do texto. Verifique se o texto está completo.")
        return
      }
      onProcessed(result)
    } catch {
      setError("Erro ao processar o texto. Tente novamente.")
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <ClipboardPaste className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Colar texto do PDF
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cole o texto copiado do seu PDF para processamento
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                aria-label="Como funciona?"
              >
                <HelpCircle className="size-3.5" />
                Como funciona?
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Como usar o Rosanurse</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-1">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {i + 1}. {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="relative">
            <textarea
              placeholder="Cole aqui o texto copiado do PDF..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={12}
              style={{ cursor: cursorSvg }}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Texto do PDF"
            />
            <button
              onClick={handlePaste}
              title="Colar texto"
              className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Colar texto"
            >
              {pasted ? <Check className="size-4 text-primary" /> : <ClipboardPaste className="size-4" />}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleProcess}
            disabled={!pastedText.trim()}
            size="lg"
            className="mt-6 w-full text-base font-semibold"
          >
            Processar
          </Button>
        </div>
      </div>
    </div>
  )
}
