import { STYLES } from './styles'

const loaded = new Set<string>()
const failed = new Set<string>()

/** China-friendly CSS hosts first; Google last. */
const FONT_CSS_HOSTS = ['fonts.loli.net', 'fonts.font.im', 'fonts.googleapis.com'] as const

const FONTS_LOAD_TIMEOUT_MS = 4000

function buildCssUrl(family: string, weights?: string, host = 'fonts.googleapis.com'): string {
  const fam = encodeURIComponent(family)
  const wght = weights ? `:wght@${weights}` : ''
  return `https://${host}/css2?family=${fam}${wght}&display=swap`
}

function injectLink(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[data-gf="${href}"]`)
    if (existing) {
      resolve()
      return
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.dataset.gf = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load ${href}`))
    document.head.appendChild(link)
  })
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

async function waitForFaces(family: string, weights?: string): Promise<void> {
  const face = weights ? `700 48px "${family}"` : `400 48px "${family}"`
  try {
    await withTimeout(document.fonts.load(face), FONTS_LOAD_TIMEOUT_MS)
    if (weights) {
      for (const w of weights.split(';')) {
        await withTimeout(document.fonts.load(`${w} 48px "${family}"`), FONTS_LOAD_TIMEOUT_MS).catch(
          () => undefined,
        )
      }
    }
  } catch {
    // Stylesheet loaded but fonts.load timed out / failed — best-effort; do not fail the family
  }
}

async function loadFamily(family: string, weights?: string): Promise<void> {
  const key = `${family}|${weights ?? ''}`
  if (loaded.has(key)) return
  if (failed.has(key)) throw new Error(`Font previously failed: ${family}`)

  let stylesheetOk = false
  let lastError: unknown

  for (const host of FONT_CSS_HOSTS) {
    const href = buildCssUrl(family, weights, host)
    try {
      await injectLink(href)
      stylesheetOk = true
      break
    } catch (e) {
      lastError = e
    }
  }

  if (!stylesheetOk) {
    throw lastError instanceof Error ? lastError : new Error(`All font hosts failed for ${family}`)
  }

  // Wait for FontFace; timeout still counts as best-effort success
  await waitForFaces(family, weights)

  loaded.add(key)
}

export async function loadAllFonts(
  onProgress?: (done: number, total: number) => void,
): Promise<{ ok: string[]; failed: string[] }> {
  const unique = new Map<string, string | undefined>()
  for (const s of STYLES) {
    if (!unique.has(s.googleFamily)) {
      unique.set(s.googleFamily, s.weights)
    } else if (s.weights) {
      // merge weights
      const prev = unique.get(s.googleFamily)
      if (prev && !prev.includes(s.weights)) {
        unique.set(s.googleFamily, `${prev};${s.weights}`)
      } else if (!prev) {
        unique.set(s.googleFamily, s.weights)
      }
    }
  }

  // Always load Noto Sans SC for UI
  unique.set('Noto Sans SC', '400;500;700')

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
        failed.add(`${family}|${weights ?? ''}`)
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
  return loaded.has(`${family}|`) || [...loaded].some((k) => k.startsWith(`${family}|`))
}
