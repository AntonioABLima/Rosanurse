"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Code, Info } from "lucide-react"
import type { ConsultaTemplate } from "@/components/templates-page"

interface TemplateEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (template: Omit<ConsultaTemplate, "id" | "createdAt" | "updatedAt">) => void
  editingTemplate?: ConsultaTemplate | null
}

const SPECIALTIES = [
  "Clinica Geral",
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Ginecologia",
  "Neurologia",
  "Oftalmologia",
  "Ortopedia",
  "Pediatria",
  "Psiquiatria",
  "Radiologia",
  "Outra",
]

const PLACEHOLDERS = [
  { tag: "{{paciente}}", label: "Nome do paciente" },
  { tag: "{{data}}", label: "Data da consulta" },
  { tag: "{{queixa_principal}}", label: "Queixa principal" },
  { tag: "{{historia_clinica}}", label: "Historia clinica" },
  { tag: "{{exame_fisico}}", label: "Exame fisico" },
  { tag: "{{hipotese_diagnostica}}", label: "Hipotese diagnostica" },
  { tag: "{{conduta}}", label: "Conduta" },
  { tag: "{{observacoes}}", label: "Observacoes" },
]

export function TemplateEditorDialog({
  open,
  onOpenChange,
  onSave,
  editingTemplate,
}: TemplateEditorDialogProps) {
  const [name, setName] = useState("")
  const [specialty, setSpecialty] = useState("Clinica Geral")
  const [body, setBody] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name)
      setSpecialty(editingTemplate.specialty)
      setBody(editingTemplate.body)
    } else {
      setName("")
      setSpecialty("Clinica Geral")
      setBody("")
    }
    setShowPreview(false)
  }, [editingTemplate, open])

  function handleInsertPlaceholder(tag: string) {
    setBody((prev) => prev + tag)
  }

  function handleSave() {
    if (!name.trim() || !body.trim()) return
    onSave({
      name: name.trim(),
      specialty,
      body: body.trim(),
      isDefault: editingTemplate?.isDefault ?? false,
    })
    onOpenChange(false)
  }

  const previewText = body
    .replace(/\{\{paciente\}\}/g, "Maria da Silva")
    .replace(/\{\{data\}\}/g, new Date().toLocaleDateString("pt-BR"))
    .replace(/\{\{queixa_principal\}\}/g, "Dor abdominal ha 3 dias")
    .replace(/\{\{historia_clinica\}\}/g, "Paciente relata dor abdominal progressiva...")
    .replace(/\{\{exame_fisico\}\}/g, "Abdome: doloroso a palpacao em FID...")
    .replace(/\{\{hipotese_diagnostica\}\}/g, "Apendicite aguda")
    .replace(/\{\{conduta\}\}/g, "Encaminhamento para avaliacao cirurgica...")
    .replace(/\{\{observacoes\}\}/g, "Retorno em 7 dias para reavaliacao")

  const isValid = name.trim().length > 0 && body.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editingTemplate ? "Editar Template" : "Novo Template"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {editingTemplate
              ? "Atualize os campos do seu modelo de consulta."
              : "Crie um modelo reutilizavel para suas consultas medicas."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="tpl-name" className="text-card-foreground">
              Nome do template
            </Label>
            <Input
              id="tpl-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Consulta de Retorno - Cardiologia"
              className="border-border bg-background focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>

          {/* Specialty */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="tpl-specialty" className="text-card-foreground">
              Especialidade
            </Label>
            <select
              id="tpl-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Placeholders helper */}
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2">
              <Info className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Campos disponiveis
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Clique em um campo para inseri-lo no corpo do template. Eles serao
              preenchidos automaticamente ao aplicar o template.
            </p>
            <div className="flex flex-wrap gap-2">
              {PLACEHOLDERS.map((p) => (
                <button
                  key={p.tag}
                  type="button"
                  onClick={() => handleInsertPlaceholder(p.tag)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  title={p.label}
                >
                  {p.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Body / Preview toggle */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tpl-body" className="text-card-foreground">
                Corpo do template
              </Label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                {showPreview ? (
                  <>
                    <Code className="size-3.5" />
                    Editar
                  </>
                ) : (
                  <>
                    <Eye className="size-3.5" />
                    Preview
                  </>
                )}
              </button>
            </div>

            {showPreview ? (
              <div className="min-h-[220px] whitespace-pre-wrap rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground">
                {previewText || (
                  <span className="text-muted-foreground">
                    Nenhum conteudo para pre-visualizar.
                  </span>
                )}
              </div>
            ) : (
              <Textarea
                id="tpl-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                placeholder={`CONSULTA MEDICA\n\nPaciente: {{paciente}}\nData: {{data}}\n\nQUEIXA PRINCIPAL\n{{queixa_principal}}\n\nHISTORIA DA DOENCA ATUAL\n{{historia_clinica}}\n\nEXAME FISICO\n{{exame_fisico}}\n\nHIPOTESE DIAGNOSTICA\n{{hipotese_diagnostica}}\n\nCONDUTA\n{{conduta}}\n\nOBSERVACOES\n{{observacoes}}`}
                className="min-h-[220px] resize-none border-border bg-background font-mono text-sm focus-visible:border-primary focus-visible:ring-primary/30"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="font-semibold"
            >
              {editingTemplate ? "Salvar alteracoes" : "Criar template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
