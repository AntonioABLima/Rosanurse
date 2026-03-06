"use client"

import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react"

const helpItems = [
  {
    icon: <BookOpen className="size-5 text-primary" />,
    title: "Documentacao",
    description: "Consulte nossos guias e tutoriais para aproveitar ao maximo a plataforma.",
  },
  {
    icon: <MessageCircle className="size-5 text-primary" />,
    title: "FAQ",
    description: "Encontre respostas para as perguntas mais frequentes.",
  },
  {
    icon: <Mail className="size-5 text-primary" />,
    title: "Contato",
    description: "Entre em contato com nosso time de suporte para assistencia personalizada.",
  },
]

export function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <HelpCircle className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Ajuda
            </h1>
            <p className="text-sm text-muted-foreground">
              Como podemos ajudar voce?
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {helpItems.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-5 shadow-sm transition-colors hover:border-primary/40 cursor-pointer"
          >
            <div className="mt-0.5">{item.icon}</div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
