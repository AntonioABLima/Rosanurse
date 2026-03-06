"use client"

import { Settings, User, Bell, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemePicker } from "@/components/theme-picker"

export function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <Settings className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Configuracoes
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie sua conta e preferencias
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Theme section */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Aparencia</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Escolha o tema que melhor se adapta ao seu ambiente de trabalho.
          </p>
          <ThemePicker />
        </section>

        {/* Profile section */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <User className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Perfil</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-card-foreground">Nome</Label>
              <Input
                id="name"
                defaultValue="Usuario"
                className="bg-background border-border focus-visible:border-primary focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-email" className="text-card-foreground">E-mail</Label>
              <Input
                id="settings-email"
                defaultValue="usuario@email.com"
                className="bg-background border-border focus-visible:border-primary focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </section>

        {/* Notifications section */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Notificacoes</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Receba notificacoes quando seus PDFs forem processados.
          </p>
        </section>

        {/* Security section */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Seguranca</h2>
          </div>
          <Button variant="outline" size="sm">
            Alterar senha
          </Button>
        </section>
      </div>
    </div>
  )
}
