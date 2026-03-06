"use client"

import { useState } from "react"
import { Stethoscope, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ConsultaPageProps {
  onProcessed: (text: string) => void
}

// Placeholder — será substituído por dados reais da API
const MOCK_TEMPLATES = [
  { id: "1", name: "Consulta Geral" },
  { id: "2", name: "Pré-natal" },
  { id: "3", name: "Pediatria" },
]

export function ConsultaPage({ onProcessed }: ConsultaPageProps) {
  const [templateId, setTemplateId] = useState("")
  const [patientData, setPatientData] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const canSubmit = templateId !== "" && patientData.trim() !== ""

  async function handleSubmit() {
    if (!canSubmit) return
    setIsProcessing(true)
    // TODO: chamar API com templateId + patientData
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onProcessed(`Consulta gerada com base no template selecionado.\n\n${patientData}`)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <Stethoscope className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Nova Consulta
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione um template e insira os dados do paciente
          </p>
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="template">Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger id="template" className="w-full">
                <SelectValue placeholder="Selecione um template..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="patient-data">Dados do paciente</Label>
            <Textarea
              id="patient-data"
              placeholder="Descreva os dados do paciente aqui..."
              value={patientData}
              onChange={(e) => setPatientData(e.target.value)}
              className="min-h-[180px] resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isProcessing}
            size="lg"
            className="w-full text-base font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Consulta"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
