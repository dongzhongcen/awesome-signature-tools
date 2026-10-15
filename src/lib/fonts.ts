import { STYLES } from './styles'

const loaded = new Set<string>()
const failed = new Set<string>()

/**
 * Self-hosted OFL woff2 under public/fonts/.
 * Paths are resolved with Vite BASE_URL so both
 * GitHub Pages (/awesome-signature-tools/) and relative CDN (./) work.
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
  { family: 'Noto Sans SC', weight: 700, file: 'NotoSansSC-700.woff2' },
  { family: 'Noto Sans SC', weight: 900, file: 'NotoSansSC-900.woff2' },
  { family: 'Noto Serif SC', weight: 700, file: 'NotoSerifSC-700.woff2' },
  { family: 'Noto Serif SC', weight: 900, file: 'NotoSerifSC-900.woff2' },
]

const FONTS_LOAD_TIMEOUT_MS = 8000

function fontUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/'
  // Ensure single slash join for both "./" and "/awesome-signature-tools/"
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

  const url = fontUrl(entry.file)
  const face = new FontFace(entry.family, `url(${JSON.stringify(url)}) format("woff2")`, {
    weight: String(entry.weight),
    style: 'normal',
    display: 'swap',
  })

  try {
    await withTimeout(face.load(), FONTS_LOAD_TIMEOUT_MS)
    document.fonts.add(face)
    loaded.add(key)
  } catch (e) {
    failed.add(key)
    throw e instanceof Error ? e : new Error(String(e))
  }
}

function filesNeededForFamily(family: string, weights?: string): FontFile[] {
  const wanted = weights
    ? new Set(weights.split(';').map((w) => Number(w)))
    : null

  const matches = FONT_FILES.filter((f) => {
    if (f.family !== family) return false
    if (!wanted) return f.weight === 400 || FONT_FILES.filter((x) => x.family === family).length === 1
    return wanted.has(f.weight)
  })

  // Display families: single Regular covers all
  if (matches.length === 0) {
    return FONT_FILES.filter((f) => f.family === family)
  }
  return matches
}

async function loadFamily(family: string, weights?: string): Promise<void> {
  const files = filesNeededForFamily(family, weights)
  if (files.length === 0) {
    throw new Error(`No local font files for ${family}`)
  }
  // Load all weight files for this family; one failure fails the family
  await Promise.all(files.map((f) => loadFontFile(f)))
}

export async function loadAllFonts(
  onProgress?: (done: number, total: number) => void,
): Promise<{ ok: string[]; failed: string[] }> {
  const unique = new Map<string, string | undefined>()
  for (const s of STYLES) {
    if (!unique.has(s.googleFamily)) {
      unique.set(s.googleFamily, s.weights)
    } else if (s.weights) {
      const prev = unique.get(s.googleFamily)
      if (prev && !prev.includes(s.weights)) {
        unique.set(s.googleFamily, `${prev};${s.weights}`)
      } else if (!prev) {
        unique.set(s.googleFamily, s.weights)
      }
    }
  }

  // Always load Noto Sans SC for UI (400/500/700)
  const uiPrev = unique.get('Noto Sans SC')
  unique.set(
    'Noto Sans SC',
    uiPrev ? Array.from(new Set([...uiPrev.split(';'), '400', '500', '700'])).join(';') : '400;500;700',
  )

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

export function isFontReady(family: string): boolean {
  return [...loaded].some((k) => k.startsWith(`${family}|`))
}
