"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ClipboardList,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Star,
  StarOff,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateEditorDialog } from "@/components/template-editor-dialog"

export interface ConsultaTemplate {
  id: string
  name: string
  specialty: string
  body: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

const DEFAULT_TEMPLATE: ConsultaTemplate = {
  id: "default-consulta-geral",
  name: "Consulta Geral",
  specialty: "Clinica Geral",
  body: `CONSULTA MEDICA

Paciente: {{paciente}}
Data: {{data}}

QUEIXA PRINCIPAL
{{queixa_principal}}

HISTORIA DA DOENCA ATUAL
{{historia_clinica}}

EXAME FISICO
{{exame_fisico}}

HIPOTESE DIAGNOSTICA
{{hipotese_diagnostica}}

CONDUTA
{{conduta}}

OBSERVACOES
{{observacoes}}`,
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const STORAGE_KEY = "saudepdf-templates"

function loadTemplates(): ConsultaTemplate[] {
  if (typeof window === "undefined") return [DEFAULT_TEMPLATE]
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return [DEFAULT_TEMPLATE]
}

function saveTemplates(templates: ConsultaTemplate[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function TemplatesPage() {
  const [templates, setTemplates] = useState<ConsultaTemplate[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<ConsultaTemplate | null>(null)

  useEffect(() => {
    setTemplates(loadTemplates())
  }, [])

  const persist = useCallback((next: ConsultaTemplate[]) => {
    setTemplates(next)
    saveTemplates(next)
  }, [])

  function handleSave(
    data: Omit<ConsultaTemplate, "id" | "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString()
    if (editing) {
      persist(
        templates.map((t) =>
          t.id === editing.id ? { ...t, ...data, updatedAt: now } : t
        )
      )
    } else {
      const newTemplate: ConsultaTemplate = {
        ...data,
        id: `tpl-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }
      persist([...templates, newTemplate])
    }
    setEditing(null)
  }

  function handleEdit(template: ConsultaTemplate) {
    setEditing(template)
    setEditorOpen(true)
  }

  function handleDuplicate(template: ConsultaTemplate) {
    const now = new Date().toISOString()
    const dup: ConsultaTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      name: `${template.name} (copia)`,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    }
    persist([...templates, dup])
  }

  function handleDelete(id: string) {
    persist(templates.filter((t) => t.id !== id))
  }

  function handleToggleDefault(id: string) {
    persist(
      templates.map((t) => ({
        ...t,
        isDefault: t.id === id ? !t.isDefault : false,
        updatedAt: t.id === id ? new Date().toISOString() : t.updatedAt,
      }))
    )
  }

  function handleCreate() {
    setEditing(null)
    setEditorOpen(true)
  }

  function getBodyPreview(body: string) {
    const cleaned = body.replace(/\{\{[^}]+\}\}/g, "___").trim()
    return cleaned.length > 120 ? cleaned.slice(0, 120) + "..." : cleaned
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <ClipboardList className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Templates de Consulta
            </h1>
            <p className="text-sm text-muted-foreground">
              Modelos reutilizaveis para laudos e consultas
            </p>
          </div>
        </div>
        <Button onClick={handleCreate} className="shrink-0 font-semibold">
          <Plus className="size-4" />
          Novo template
        </Button>
      </div>

      {/* Templates list */}
      {templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <FileText className="mx-auto mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            Nenhum template criado
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crie seu primeiro modelo de consulta para agilizar seus laudos.
          </p>
          <Button
            onClick={handleCreate}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <Plus className="size-4" />
            Criar template
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">
                      {template.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="border border-border text-xs font-medium"
                    >
                      {template.specialty}
                    </Badge>
                    {template.isDefault && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs font-medium">
                        Padrao
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {getBodyPreview(template.body)}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground/70">
                    Atualizado em{" "}
                    {new Date(template.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleToggleDefault(template.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    title={
                      template.isDefault
                        ? "Remover como padrao"
                        : "Definir como padrao"
                    }
                    aria-label={
                      template.isDefault
                        ? "Remover como padrao"
                        : "Definir como padrao"
                    }
                  >
                    {template.isDefault ? (
                      <Star className="size-4 fill-primary text-primary" />
                    ) : (
                      <StarOff className="size-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    title="Editar"
                    aria-label="Editar template"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    title="Duplicar"
                    aria-label="Duplicar template"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Excluir"
                    aria-label="Excluir template"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      <TemplateEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSave}
        editingTemplate={editing}
      />
    </div>
  )
}
