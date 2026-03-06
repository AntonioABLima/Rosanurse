"use client"

import { History, FileText } from "lucide-react"

const mockHistory = [
  { id: 1, name: "relatorio-financeiro.pdf", date: "25/02/2026", status: "Concluido" },
  { id: 2, name: "contrato-servico.pdf", date: "24/02/2026", status: "Concluido" },
  { id: 3, name: "notas-reuniao.pdf", date: "22/02/2026", status: "Concluido" },
]

export function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <History className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Historico
            </h1>
            <p className="text-sm text-muted-foreground">
              Seus PDFs processados anteriormente
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {mockHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm"
          >
            <FileText className="size-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
