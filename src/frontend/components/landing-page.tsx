"use client"

import { Heart, FileText, ArrowRight, Stethoscope, ClipboardList, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LandingPageProps {
  onEnter: () => void
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="size-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">Rosanurse</span>
        </div>
        <Button onClick={onEnter} size="sm">
          Começar
        </Button>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-primary shadow-lg">
          <FileText className="size-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Leitura de Exames
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Envie o PDF de um exame laboratorial e obtenha uma leitura estruturada
          dos resultados, pronta para copiar no prontuário.
        </p>
        <Button onClick={onEnter} size="lg" className="mt-8 gap-2 text-base font-semibold">
          Enviar exame
          <ArrowRight className="size-5" />
        </Button>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground">
            O que está disponível agora e o que vem por aí
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Active feature */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-primary bg-background p-6 text-center shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="size-6 text-primary" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="font-semibold text-foreground">Leitura de exames</h3>
                <Badge variant="default" className="text-xs">Disponível</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Envie o PDF de um exame e obtenha os resultados estruturados,
                com destaque para valores alterados.
              </p>
            </div>

            {/* Coming soon */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-6 text-center shadow-sm opacity-60">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <ClipboardList className="size-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="font-semibold text-foreground">Anamnese</h3>
                <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" /> Em breve
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Registre a anamnese do paciente de forma guiada e gere o
                texto clínico automaticamente.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-6 text-center shadow-sm opacity-60">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Stethoscope className="size-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="font-semibold text-foreground">Consulta</h3>
                <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" /> Em breve
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Selecione um template de consulta, informe os dados do paciente e
                receba a documentação clínica pronta para colar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Rosanurse · Desenvolvido para profissionais de enfermagem
      </footer>
    </div>
  )
}
