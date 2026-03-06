"use client"

import { useState, useEffect } from "react"
import {
  ClipboardCheck,
  FileText,
  RotateCcw,
  ClipboardList,
  ChevronDown,
  Star,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConsultaTemplate } from "@/components/templates-page"

interface ResultPageProps {
  text: string
  onReset: () => void
  onNavigateTemplates?: () => void
}

const STORAGE_KEY = "saudepdf-templates"

function loadTemplates(): ConsultaTemplate[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore
  }
  return []
}

export function ResultPage({ text, onReset, onNavigateTemplates }: ResultPageProps) {
  const [copied, setCopied] = useState(false)
  const [templates, setTemplates] = useState<ConsultaTemplate[]>([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [appliedTemplate, setAppliedTemplate] = useState<ConsultaTemplate | null>(null)
  const [filledText, setFilledText] = useState("")

  useEffect(() => {
    setTemplates(loadTemplates())
  }, [])

  async function handleCopy() {
    const textToCopy = filledText || text
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleApplyTemplate(template: ConsultaTemplate) {
    const filled = template.body
      .replace(/\{\{paciente\}\}/g, "_______________")
      .replace(/\{\{data\}\}/g, new Date().toLocaleDateString("pt-BR"))
      .replace(/\{\{queixa_principal\}\}/g, text.slice(0, 200))
      .replace(/\{\{historia_clinica\}\}/g, text)
      .replace(/\{\{exame_fisico\}\}/g, "_______________")
      .replace(/\{\{hipotese_diagnostica\}\}/g, "_______________")
      .replace(/\{\{conduta\}\}/g, "_______________")
      .replace(/\{\{observacoes\}\}/g, "_______________")

    setAppliedTemplate(template)
    setFilledText(filled)
    setShowTemplateSelector(false)
  }

  function handleClearTemplate() {
    setAppliedTemplate(null)
    setFilledText("")
  }

  const displayText = filledText || text

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
            {appliedTemplate
              ? `Template aplicado: ${appliedTemplate.name}`
              : "O texto extraido do seu PDF"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Applied template indicator */}
          {appliedTemplate && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  {appliedTemplate.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {appliedTemplate.specialty}
                </span>
              </div>
              <button
                onClick={handleClearTemplate}
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Remover
              </button>
            </div>
          )}

          <div className="relative">
            <textarea
              readOnly
              value={displayText}
              rows={12}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm leading-relaxed text-foreground focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Texto extraido do PDF"
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

          {/* Template selector dropdown */}
          {showTemplateSelector && (
            <div className="mt-3 rounded-xl border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Escolha um template
                </span>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Fechar
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Nenhum template salvo.
                  </p>
                  {onNavigateTemplates && (
                    <button
                      onClick={onNavigateTemplates}
                      className="mt-2 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Criar seu primeiro template
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleApplyTemplate(template)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-card"
                    >
                      {template.isDefault && (
                        <Star className="size-3.5 shrink-0 fill-primary text-primary" />
                      )}
                      {!template.isDefault && (
                        <ClipboardList className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                          {template.name}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {template.specialty}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {/* Apply template button */}
            {!appliedTemplate && (
              <Button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                variant="outline"
                size="lg"
                className="w-full text-base font-semibold"
              >
                <ClipboardList className="size-4" />
                Aplicar template
                <ChevronDown className={`size-4 transition-transform ${showTemplateSelector ? "rotate-180" : ""}`} />
              </Button>
            )}

            {appliedTemplate && (
              <Button
                onClick={handleClearTemplate}
                variant="outline"
                size="lg"
                className="w-full text-base font-semibold"
              >
                <ArrowLeft className="size-4" />
                Voltar ao texto original
              </Button>
            )}

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
              Processar outro PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
