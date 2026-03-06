"use client"

import { useState, useRef, useCallback } from "react"
import { CloudUpload, FileText, Loader2, X, HelpCircle, Upload, Cpu, ClipboardCopy, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { processPDF } from "@/lib/pdf-processor"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const steps = [
  {
    icon: <Upload className="size-5 text-primary" />,
    title: "Envie o PDF",
    description: "Arraste ou selecione o arquivo de exames ou resultado do paciente.",
  },
  {
    icon: <Cpu className="size-5 text-primary" />,
    title: "Processe",
    description: 'Clique em "Processar" para extrair e organizar o texto automaticamente.',
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
  const [file, setFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    if (f.type === "application/pdf") {
      setFile(f)
    }
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) handleFile(selected)
  }

  function clearFile() {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleProcess() {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    try {
      const text = await processPDF(file)
      onProcessed(text)
    } catch (e) {
      setError("Não foi possível processar o PDF. Verifique se o arquivo é válido.")
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <CloudUpload className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Upload de PDF
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Envie seu arquivo para processamento
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
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
            }}
            aria-label="Arraste seu PDF aqui ou clique para selecionar"
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-accent bg-background hover:border-primary/60"
            }`}
          >
            <CloudUpload
              className={`size-12 ${
                isDragOver ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              Arraste seu PDF aqui ou clique para selecionar
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInputChange}
              className="sr-only"
              aria-hidden="true"
            />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
              <FileText className="size-5 shrink-0 text-primary" />
              <span className="flex-1 truncate text-sm font-medium text-foreground">
                {file.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Remover arquivo"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleProcess}
            disabled={!file || isProcessing}
            size="lg"
            className="mt-6 w-full text-base font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Processando...
              </>
            ) : (
              "Processar"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
