import { STYLES } from './styles'
import type { StyleDef } from './types'

const loaded = new Set<string>()
const failed = new Set<string>()
const inflight = new Map<string, Promise<void>>()

/**
 * Self-hosted OFL woff2 under public/fonts/ (Chinese personal-name subsets).
 * Paths use Vite BASE_URL so GitHub Pages and relative CDN / file:// work.
 */
type FontFile = {
  family: string
  weight: number
  file: string
}

const FONT_FILES: FontFile[] = [
  { family: 'Ma Shan Zheng', weight: 400, file: 'MaShanZheng-Regular.woff2' },
  { family: 'Zhi Mang Xing', weight: 400, file: 'ZhiMangXing-Regular.woff2' },
  { family: 'Liu Jian Mao Cao', weight: 400, file: 'LiuJianMaoCao-Regular.woff2' },
  { family: 'Long Cang', weight: 400, file: 'LongCang-Regular.woff2' },
  { family: 'ZCOOL XiaoWei', weight: 400, file: 'ZCOOLXiaoWei-Regular.woff2' },
  { family: 'ZCOOL QingKe HuangYou', weight: 400, file: 'ZCOOLQingKeHuangYou-Regular.woff2' },
  { family: 'Noto Sans SC', weight: 400, file: 'NotoSansSC-400.woff2' },
  { family: 'Noto Sans SC', weight: 500, file: 'NotoSansSC-500.woff2' },
  { family: 'Noto Sans SC', weight: 900, file: 'NotoSansSC-900.woff2' },
  { family: 'Noto Serif SC', weight: 700, file: 'NotoSerifSC-700.woff2' },
  { family: 'Noto Serif SC', weight: 900, file: 'NotoSerifSC-900.woff2' },
]

const FONTS_LOAD_TIMEOUT_MS = 8000

/** Default display style + UI sans — only these load at startup. */
export const DEFAULT_DISPLAY_FAMILY = 'Ma Shan Zheng'
export const UI_FAMILY = 'Noto Sans SC'
export const UI_WEIGHTS = '400'

function fontUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}fonts/${file}`
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (v) => {
        window.clearTimeout(timer)
        resolve(v)
      },
      (e) => {
        window.clearTimeout(timer)
        reject(e)
      },
    )
  })
}

async function loadFontFile(entry: FontFile): Promise<void> {
  const key = `${entry.family}|${entry.weight}`
  if (loaded.has(key)) return
  if (failed.has(key)) throw new Error(`Font previously failed: ${entry.family} ${entry.weight}`)

  const existing = inflight.get(key)
  if (existing) return existing

  const url = fontUrl(entry.file)
  const face = new FontFace(entry.family, `url(${JSON.stringify(url)}) format("woff2")`, {
    weight: String(entry.weight),
    style: 'normal',
    display: 'swap',
  })

  const p = (async () => {
    try {
      await withTimeout(face.load(), FONTS_LOAD_TIMEOUT_MS)
      document.fonts.add(face)
      loaded.add(key)
    } catch (e) {
      failed.add(key)
      throw e instanceof Error ? e : new Error(String(e))
    } finally {
      inflight.delete(key)
    }
  })()
  inflight.set(key, p)
  return p
}

function filesNeededForFamily(family: string, weights?: string): FontFile[] {
  const wanted = weights
    ? new Set(weights.split(';').map((w) => Number(w.trim())).filter((n) => !Number.isNaN(n)))
    : null

  const familyFiles = FONT_FILES.filter((f) => f.family === family)
  if (familyFiles.length === 0) return []

  if (!wanted || wanted.size === 0) {
    // Single-file display families, or default to 400
    if (familyFiles.length === 1) return familyFiles
    return familyFiles.filter((f) => f.weight === 400)
  }

  const matches = familyFiles.filter((f) => wanted.has(f.weight))
  return matches.length > 0 ? matches : familyFiles
}

export async function loadFamily(family: string, weights?: string): Promise<void> {
  const files = filesNeededForFamily(family, weights)
  if (files.length === 0) {
    throw new Error(`No local font files for ${family}`)
  }
  await Promise.all(files.map((f) => loadFontFile(f)))
}

/** Startup: Ma Shan Zheng + Noto Sans SC 400 only. */
export async function loadInitialFonts(): Promise<{ ok: string[]; failed: string[] }> {
  const ok: string[] = []
  const bad: string[] = []
  for (const [family, weights] of [
    [UI_FAMILY, UI_WEIGHTS],
    [DEFAULT_DISPLAY_FAMILY, '400'],
  ] as const) {
    try {
      await loadFamily(family, weights)
      ok.push(family)
    } catch {
      bad.push(family)
    }
  }
  return { ok, failed: bad }
}

/** Load fonts required by one style definition. */
export async function loadStyleFonts(style: StyleDef): Promise<void> {
  await loadFamily(style.googleFamily, style.weights ?? '400')
}

/** Load fonts for a list of style ids (e.g. multi-generate). */
export async function loadStylesFonts(
  styleIds: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<{ ok: string[]; failed: string[] }> {
  const unique = new Map<string, string | undefined>()
  for (const id of styleIds) {
    const s = STYLES.find((x) => x.id === id)
    if (!s) continue
    const prev = unique.get(s.googleFamily)
    const w = s.weights ?? '400'
    if (!prev) unique.set(s.googleFamily, w)
    else {
      const merged = Array.from(new Set([...prev.split(';'), ...w.split(';')])).join(';')
      unique.set(s.googleFamily, merged)
    }
  }

  const entries = [...unique.entries()]
  const ok: string[] = []
  const bad: string[] = []
  let done = 0
  await Promise.all(
    entries.map(async ([family, weights]) => {
      try {
        await loadFamily(family, weights)
        ok.push(family)
      } catch {
        bad.push(family)
      } finally {
        done += 1
        onProgress?.(done, entries.length)
      }
    }),
  )
  return { ok, failed: bad }
}

export function isFontReady(family: string, weight?: number): boolean {
  if (weight != null) return loaded.has(`${family}|${weight}`)
  return [...loaded].some((k) => k.startsWith(`${family}|`))
}

export function isStyleFontReady(style: StyleDef): boolean {
  const weights = (style.weights ?? '400').split(';').map((w) => Number(w.trim()))
  return weights.every((w) => isFontReady(style.googleFamily, w) || isFontReady(style.googleFamily))
}

/**
 * Detect CJK chars missing from the loaded subset via canvas .notdef comparison.
 */
export function findMissingGlyphs(
  family: string,
  text: string,
  weight = '400',
): string[] {
  if (!text || typeof document === 'undefined') return []
  const canvas = document.createElement('canvas')
  const size = 48
  canvas.width = size * 2
  canvas.height = size * 2
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  const render = (ch: string): Uint8ClampedArray => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = `${weight} ${size}px "${family}"`
    ctx.fillText(ch, size, size)
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data
  }

  // Private-use / unlikely codepoint → .notdef reference for this face
  const ref = render('\uE000')
  const missing: string[] = []
  const seen = new Set<string>()

  for (const ch of text) {
    if (seen.has(ch)) continue
    seen.add(ch)
    // Only tip for CJK unified ideographs
    if (ch < '\u4e00' || ch > '\u9fff') continue
    const data = render(ch)
    let same = true
    for (let i = 0; i < ref.length; i++) {
      if (ref[i] !== data[i]) {
        same = false
        break
      }
    }
    if (same) missing.push(ch)
  }
  return missing
}
