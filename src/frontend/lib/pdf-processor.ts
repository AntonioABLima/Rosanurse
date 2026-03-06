"use client"

import type { PDFParser } from "./pdf-parsers/types"
import { MenaParser } from "./pdf-parsers/mena"

// Registry of all supported PDF formats.
// To add a new format: implement PDFParser and add it here.
const PARSERS: PDFParser[] = [MenaParser]

// ── pdfjs text extraction ────────────────────────────────────────────────────

type TextItem = { str: string; transform: number[] }

async function extractLines(file: File): Promise<string[]> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist/legacy/build/pdf.mjs")

  // Worker bundled locally in /public — prefix with basePath for GitHub Pages
  GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/pdf.worker.min.mjs`

  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise

  const allLines: string[] = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const tc = await page.getTextContent()

    // Group text items by Y coordinate (same visual line)
    const byY = new Map<number, string[]>()
    for (const raw of tc.items) {
      const item = raw as TextItem
      if (!item.str.trim()) continue
      const y = Math.round(item.transform[5])
      if (!byY.has(y)) byY.set(y, [])
      byY.get(y)!.push(item.str)
    }

    // Sort top→bottom (PDF y-axis is bottom→up, so sort descending)
    const sortedYs = Array.from(byY.keys()).sort((a, b) => b - a)
    for (const y of sortedYs) {
      const line = byY.get(y)!.join("").trim()
      if (line) allLines.push(line)
    }
  }

  return allLines
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function processPDF(file: File): Promise<string> {
  const lines = await extractLines(file)

  console.log("[processPDF] extracted", lines.length, "lines")
  console.log("[processPDF] first 10 lines:", lines.slice(0, 10))

  for (const parser of PARSERS) {
    const matched = parser.detect(lines)
    console.log(`[processPDF] parser "${parser.name}" detect:`, matched)
    if (matched) {
      return parser.parse(lines)
    }
  }

  // Fallback: return raw lines joined (unknown format)
  console.log("[processPDF] no parser matched — returning raw text")
  return lines.join("\n")
}
