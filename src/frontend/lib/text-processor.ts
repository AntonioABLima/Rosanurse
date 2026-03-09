"use client"

// ── Strip helpers ─────────────────────────────────────────────────────────────

const STRIP_PATTERNS: RegExp[] = [
  /^O\.S\.\:/,
  /^Paciente:/,
  /^Idade:/,
  /^Médico/,
  /^Categoria:/,
  /^Data de cadastro:/,
  /^Passaporte:/,
  /^Responsável Técnica:/,
  /^Endereço:/,
  /^A correta interpretação/,
  /^Página:/,
  /^Assinado Eletronicamente/,
  /^Assinatura Digital:/,
  /^Valores Referenciais$/,
  /^Obs\.:?/,
]

function shouldStrip(line: string): boolean {
  return STRIP_PATTERNS.some((r) => r.test(line))
}

// ── ERITROGRAMA parser ────────────────────────────────────────────────────────
// Input:  "Eritrócitos : 4,62 milhões/mm3 3,9 - 5,0"
// Output: "Eritrócitos 4,62 milhões/mm3"

const ERITROGRAMA_PARAMS = [
  "Eritrócitos",
  "Hemoglobina",
  "Hematócrito",
  "VCM",
  "CHCM",
  "HCM",
  "RDW",
]

const ERITROGRAMA_UNITS = ["milhões/mm3", "g/dL", "fL", "pg"]

function parseEritrogramaLine(line: string): string | null {
  const col = line.indexOf(":")
  if (col === -1) return null
  const param = line.slice(0, col).trim()
  if (!ERITROGRAMA_PARAMS.includes(param)) return null
  const rest = line.slice(col + 1).trim()

  const pctMatch = rest.match(/^(\d+[,.]\d+)\s*%/)
  if (pctMatch) return `${param} ${pctMatch[1]} %`

  for (const unit of ERITROGRAMA_UNITS) {
    const idx = rest.indexOf(unit)
    if (idx !== -1) {
      const value = rest.slice(0, idx).trim()
      return `${param} ${value} ${unit}`
    }
  }

  return null
}

// ── LEUCOGRAMA parser ─────────────────────────────────────────────────────────
// Differential: "Segmentados : 56,3 % 4053,6 1.700 - 8.000" → "Segmentados 56,3 %"
// Total:        "Leucócitos : 7.200 /mm3 ..."               → "Leucócitos 7.200 /mm3"
// Plaquetas:    "Plaquetas : 326.000/mm3 ..."               → { type: "plaq", value: "Plaquetas: 326.000/mm3" }

const DIFF_PARAMS = [
  "Leucócitos",
  "Promielócitos",
  "Mielócitos",
  "Metamielócitos",
  "Bastonetes",
  "Segmentados",
  "Eosinófilos",
  "Basófilos",
  "Linfócitos Típicos",
  "Linfócitos Atípicos",
  "Monócitos",
  "Blastos",
]

function parseLeucogramaLine(
  line: string,
): { type: "leuco" | "plaq"; value: string } | null {
  const col = line.indexOf(":")
  if (col === -1) return null
  const param = line.slice(0, col).trim()
  const rest = line.slice(col + 1).trim()

  if (param === "Plaquetas") {
    // "326.000/mm3 ..." or "326.000 /mm3 ..."
    const idx = rest.indexOf("/mm3")
    if (idx !== -1) {
      const val = rest.slice(0, idx).trim().replace(/\s+/g, "")
      return { type: "plaq", value: `Plaquetas: ${val}/mm3` }
    }
  }

  if (param === "Leucócitos") {
    const idx = rest.indexOf("/mm3")
    if (idx !== -1) {
      const val = rest.slice(0, idx).trim()
      return { type: "leuco", value: `Leucócitos ${val} /mm3` }
    }
  }

  if (DIFF_PARAMS.includes(param)) {
    const pct = rest.match(/^(\d+[,.]\d+)\s*%/)
    if (pct) return { type: "leuco", value: `${param} ${pct[1]} %` }
  }

  return null
}

// ── Simple exam result parser ─────────────────────────────────────────────────
// Input:  "Resultado : 25,0 ng/mL"
// Output: "25,0 ng/mL"

const RESULT_UNITS = ["ng/mL", "pg/mL", "mg/dL", "UI/L", "mUI/mL", "pg"]

function parseResultLine(line: string): string | null {
  if (!/^Resultado\s*:/.test(line)) return null
  const val = line.replace(/^Resultado\s*:/, "").trim()

  for (const unit of RESULT_UNITS) {
    const idx = val.indexOf(unit)
    if (idx !== -1) {
      const num = val.slice(0, idx).trim()
      return `${num} ${unit}`
    }
  }

  return val || null
}

// ── Section formatters ────────────────────────────────────────────────────────

function formatHemograma(header: string, lines: string[]): string {
  const eritro: string[] = []
  const leuco: string[] = []
  let plaq = ""
  let mode: "none" | "eritro" | "leuco" = "none"

  for (const line of lines) {
    const upper = line.toUpperCase()
    if (upper.startsWith("ERITROGRAMA")) {
      mode = "eritro"
      continue
    }
    if (upper === "LEUCOGRAMA") {
      mode = "leuco"
      continue
    }

    if (mode === "eritro") {
      const r = parseEritrogramaLine(line)
      if (r) eritro.push(r)
    } else if (mode === "leuco") {
      const r = parseLeucogramaLine(line)
      if (r) {
        if (r.type === "plaq") plaq = r.value
        else leuco.push(r.value)
      }
    }
  }

  const parts: string[] = []
  if (eritro.length) parts.push(`Eritrograma: ${eritro.join(", ")}`)
  if (leuco.length) parts.push(`Leucograma: ${leuco.join(", ")}`)
  if (plaq) parts.push(plaq)

  return `${header} (${parts.join(". ")})`
}

function formatSimpleExam(header: string, lines: string[]): string | null {
  for (const line of lines) {
    const result = parseResultLine(line)
    if (result) return `${header}: ${result}`
  }
  return null
}

// ── Public API ────────────────────────────────────────────────────────────────

export function processText(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean)

  // Split into exam sections at each "Amostra colhida em:" marker
  const sections: string[][] = []
  let current: string[] = []

  for (const line of lines) {
    if (shouldStrip(line)) continue
    if (/^Amostra colhida em:/.test(line)) {
      if (current.length) sections.push(current)
      current = []
      continue
    }
    current.push(line)
  }
  if (current.length) sections.push(current)

  const parts: string[] = []

  for (const section of sections) {
    if (!section.length) continue
    const header = section[0].trim()
    const body = section.slice(1)

    if (header.toUpperCase().includes("HEMOGRAMA")) {
      const formatted = formatHemograma(header, body)
      if (formatted) parts.push(formatted)
    } else {
      const formatted = formatSimpleExam(header, body)
      if (formatted) parts.push(formatted)
    }
  }

  return parts.join(" | ")
}
