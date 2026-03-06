export interface PDFParser {
  name: string
  detect: (lines: string[]) => boolean
  parse: (lines: string[]) => string
}
