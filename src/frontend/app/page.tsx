"use client"

import { useState } from "react"
import { UploadPage } from "@/components/upload-page"
import { ResultPage } from "@/components/result-page"
import { SettingsPage } from "@/components/settings-page"
import { HelpPage } from "@/components/help-page"
import { LandingPage } from "@/components/landing-page"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

type Screen = "landing" | "resumo" | "result" | "settings" | "help"

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [resultText, setResultText] = useState("")

  function handleProcessed(text: string) {
    setResultText(text)
    setScreen("result")
  }

  function handleReset() {
    setResultText("")
    setScreen("resumo")
  }

  function handleLogout() {
    setResultText("")
    setScreen("landing")
  }

  function handleNavigate(target: "resumo" | "settings" | "help") {
    if (target === "resumo") setResultText("")
    setScreen(target)
  }

  const isLoggedIn = screen !== "landing"

  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col bg-background">
        {isLoggedIn && (
          <Navbar
            currentScreen={screen as "resumo" | "settings" | "help" | "result"}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}

        {screen === "landing" && <LandingPage onEnter={() => setScreen("resumo")} />}
        {screen === "resumo" && <UploadPage onProcessed={handleProcessed} />}
        {screen === "result" && (
          <ResultPage
            text={resultText}
            onReset={handleReset}
            onNavigateTemplates={() => handleNavigate("resumo")}
          />
        )}
        {screen === "settings" && <SettingsPage />}
        {screen === "help" && <HelpPage />}
      </main>
    </ThemeProvider>
  )
}
