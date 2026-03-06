import type { PDFParser } from "./types"

// ── helpers ─────────────────────────────────────────────────────────────────

/** Lines that are part of the repeated page header/footer – strip them. */
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
  /^Impresso:/,
  /^Assinado Eletronicamente/,
  /^Assinatura Digital:/,
  /^Valores Referenciais$/,
  /^Obs\.:?/,
]

function shouldStrip(line: string): boolean {
  return STRIP_PATTERNS.some((r) => r.test(line))
}

// ── ERITROGRAMA row parser ───────────────────────────────────────────────────
// Raw format:  "Eritrócitos:4,62milhões/mm33,9 -5,0"
// Percent:     "Hematócrito:39,4%35.0 -45,0"

const ERITROGRAMA_UNITS = ["milhões/mm3", "g/dL", "fL", "pg"]

function formatEritrogramaLine(raw: string): string {
  const col = raw.indexOf(":")
  if (col === -1) return raw
  const param = raw.slice(0, col).trim()
  const rest = raw.slice(col + 1).trim()

  // percentage value (Hematócrito, CHCM, RDW)
  const pctMatch = rest.match(/^(\d+[,.]\d+)\s*%/)
  if (pctMatch) {
    return `${param}: ${pctMatch[1]} %`
  }

  // known units
  for (const unit of ERITROGRAMA_UNITS) {
    const idx = rest.indexOf(unit)
    if (idx !== -1) {
      const value = rest.slice(0, idx).trim()
      return `${param}: ${value} ${unit}`
    }
  }

  return `${param}: ${rest}`
}

// ── LEUCOGRAMA row parser ────────────────────────────────────────────────────
// Total leucócitos / Plaquetas: "Leucócitos:7.200/mm33500 - 10500 /mm3"
// Differential rows:            "Segmentados:56,3 %4053,61.700 - 8.000"
// Somatória:                    "Somatória:100%"

function formatLeucogramaLine(raw: string): string {
  const col = raw.indexOf(":")
  if (col === -1) return raw
  const param = raw.slice(0, col).trim()
  const rest = raw.slice(col + 1).trim()

  // Somatória – bare percentage, no reference
  if (/^\d+%$/.test(rest)) {
    return `${param}: ${rest}`
  }

  // /mm3 rows (Leucócitos, Plaquetas)
  if (rest.includes("/mm3") && !rest.includes("%")) {
    const idx = rest.indexOf("/mm3")
    const value = rest.slice(0, idx).trim()
    return `${param}: ${value} /mm3`
  }

  // Differential percentage rows
  const pctMatch = rest.match(/^(\d+[,.]\d+)\s*%\s*(.*)$/)
  if (!pctMatch) return `${param}: ${rest}`

  const pct = pctMatch[1]
  const afterPct = pctMatch[2].trim()

  if (!afterPct || afterPct.startsWith("Até")) return `${param}: ${pct} %`

  // Absolute value follows (exactly 1 decimal digit)
  const absMatch = afterPct.match(/^(\d+,\d)/) ?? afterPct.match(/^(\d+)/)
  const absVal = absMatch ? absMatch[1] : ""

  return absVal ? `${param}: ${pct} % | ${absVal}` : `${param}: ${pct} %`
}

// ── Resultado row parser ─────────────────────────────────────────────────────
// "Resultado :25,0ng/mL"  or  "Resultado :386pg/mLValor de Referência:"
// The unit is fused with the value; separate at known units

const RESULT_UNITS = [
  "ng/mL",
  "pg/mL",
  "mg/dL",
  "UI/L",
  "pg",
  "mUI/mL",
]

function formatResultadoLine(raw: string): { result: string; extra: string } {
  // Strip "Resultado :" or "Resultado:"
  const val = raw.replace(/^Resultado\s*:/, "").trim()

  for (const unit of RESULT_UNITS) {
    const idx = val.indexOf(unit)
    if (idx !== -1) {
      const num = val.slice(0, idx).trim()
      const after = val.slice(idx + unit.length).trim()
      return { result: `Resultado: ${num} ${unit}`, extra: after }
    }
  }

  return { result: `Resultado: ${val}`, extra: "" }
}

// ── Section formatter ────────────────────────────────────────────────────────


function formatSection(sectionLines: string[]): string {
  if (sectionLines.length === 0) return ""

  const title = sectionLines[0].trim()
  const body = sectionLines.slice(1)

  const out: string[] = []

  // HEMOGRAMA – only output ERITROGRAMA and LEUCOGRAMA values
  if (title.includes("HEMOGRAMA")) {
    let mode: "skip" | "eritro" | "leuco" = "skip"

    for (const line of body) {
      if (!line.trim()) continue

      if (line.startsWith("ERITROGRAMAValores") || line === "ERITROGRAMA") {
        out.push("\nERITROGRAMA")
        mode = "eritro"
        continue
      }
      if (line === "LEUCOGRAMA") {
        out.push("\nLEUCOGRAMA")
        mode = "leuco"
        continue
      }

      if (mode === "eritro") {
        out.push(formatEritrogramaLine(line))
        continue
      }

      if (mode === "leuco") {
        out.push(formatLeucogramaLine(line))
        continue
      }
    }

    return out.join("\n")
  }

  // Simple exams (Vitamina D, Glicose, Vitamina B12, Anticorpos…)
  const meta: string[] = []
  let resultado = ""
  const refs: string[] = []
  let prevWasVitDRef = false

  for (const line of body) {
    if (!line.trim()) continue

    if (
      line.startsWith("Material:") ||
      line.startsWith("Método:") ||
      line.startsWith("Método") ||
      line.startsWith("Metodo") ||
      line.startsWith("Equipamento") ||
      line.startsWith("Método..")
    ) {
      const cleaned = line
        .replace(/^Metodo:/, "Método:")
        .replace(/^Método\.+:?\s*/, "Método: ")
        .replace(/^Equipamento\s*:?\s*/, "Equip.: ")
        .trim()
      meta.push(cleaned)
      continue
    }

    if (/^Resultado\s*:/.test(line)) {
      const { result, extra } = formatResultadoLine(line)
      resultado = result
      // Handle "Valor de Referência:" fused at end of Resultado line
      if (extra && !extra.startsWith("Valor de Referência")) {
        refs.push(`Ref: ${extra}`)
      }
      continue
    }

    // Vitamina D reference blocks
    if (/^População saudável/.test(line)) {
      prevWasVitDRef = true
      refs.push("Ref (< 60 anos):")
      continue
    }
    if (prevWasVitDRef && /^Superior a/.test(line)) {
      refs[refs.length - 1] += ` ${line.trim()}`
      prevWasVitDRef = false
      continue
    }
    if (/^População acima/.test(line)) {
      prevWasVitDRef = true
      refs.push("Ref (≥ 60 anos):")
      continue
    }
    if (prevWasVitDRef && /^\d/.test(line)) {
      refs[refs.length - 1] += ` ${line.trim()}`
      prevWasVitDRef = false
      continue
    }

    // Glicose inline ref: "70,0a 99,0mg/dL"
    if (/^\d+[,.]\d+\s*a\s*\d/.test(line)) {
      refs.push(`Ref: ${line.trim()}`)
      continue
    }

    // Vitamina B12 reference lines
    if (/^Normal:|^Normal :/.test(line)) {
      refs.push(`Ref ${line.trim()}`)
      continue
    }
    if (/^Deficiência\s*:/.test(line)) {
      refs.push(`Ref ${line.trim()}`)
      continue
    }
    // Previous result: "Em30/12/24: 361"
    const prevMatch = line.match(/^Em\s*(\d{2}\/\d{2}\/\d{2,4})\s*:\s*(\d.*)$/)
    if (prevMatch) {
      refs.push(`Resultado anterior (${prevMatch[1]}): ${prevMatch[2]}`)
      continue
    }

    // Anticorpos Anti HBS reference: "ValoresdeReferência:Nãoreagente:inferiora 10,0 UI/L"
    const antiHbsRef = line.match(/ValoresdeReferência\s*:(.+)$/)
    if (antiHbsRef) {
      refs.push(`Ref ${antiHbsRef[1].trim()}`)
      continue
    }

    // Generic ref pattern (Valor de Referência:)
    if (/^Valor\s+de\s+Referência\s*:?/i.test(line)) {
      continue // next lines will be picked up individually
    }

    // Fallback: keep the line if not otherwise handled
    // (preserves lines like "Valores superiores a 10 UI/L...")
    if (!/^Valores Referenciais/.test(line)) {
      // Only keep short informational lines, skip long reference prose
      if (line.length < 100) refs.push(line.trim())
    }
  }

  if (meta.length) out.push(meta.join(" | "))
  if (resultado) out.push(resultado)
  refs.forEach((r) => out.push(r))

  return out.join("\n")
}

// ── Main parser ──────────────────────────────────────────────────────────────

export const MenaParser: PDFParser = {
  name: "MENA Diagnóstico",

  detect(lines: string[]): boolean {
    const head = lines.slice(0, 50).join(" ")
    // Use ASCII-only markers to avoid Unicode NFD/NFC mismatch from PDF fonts
    return /O\.S\.:/.test(head) && /HEMOGRAMA/.test(head)
  },

  parse(lines: string[]): string {
    // 1. Extract patient info from first page header
    let patient = ""
    let collectedAt = ""

    for (const line of lines) {
      if (!patient && /^Paciente:/.test(line)) {
        const m = line.match(/^Paciente:\s*(.+?)(?:\s*-\s*CPF:.*)?$/)
        if (m) patient = m[1].trim()
      }
      if (!collectedAt && /^Amostra colhida em:/.test(line)) {
        const m = line.match(/Amostra colhida em:\s*(\d{2}\/\d{2}\/\d{4})/)
        if (m) collectedAt = m[1]
      }
      if (patient && collectedAt) break
    }

    // Also grab age/sex from Idade line
    let ageSex = ""
    for (const line of lines) {
      if (/^Idade:/.test(line)) {
        const m = line.match(/^Idade:\s*(.+)$/)
        if (m) ageSex = m[1].trim()
        break
      }
    }

    // 2. Build header
    const headerParts = [patient, ageSex, collectedAt ? `Coleta: ${collectedAt}` : ""].filter(Boolean)
    const header = `Paciente: ${headerParts.join(" | ")}`

    // 3. Split remaining lines into exam sections by "Amostra colhida em:"
    const sections: string[][] = []
    let current: string[] = []

    for (const line of lines) {
      if (shouldStrip(line)) continue
      if (/^Amostra colhida em:/.test(line)) {
        if (current.length) sections.push(current)
        current = []
        continue
      }
      if (line.trim()) current.push(line)
    }
    if (current.length) sections.push(current)

    // 4. Format only HEMOGRAMA sections (ERITROGRAMA + LEUCOGRAMA)
    const formatted = sections
      .filter((s) => s[0]?.includes("HEMOGRAMA"))
      .map(formatSection)
      .filter(Boolean)

    return [header, ...formatted].join("\n")
  },
}
