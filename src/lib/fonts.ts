import { STYLES } from './styles'

const loaded = new Set<string>()
const failed = new Set<string>()

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

async function loadFamily(family: string, weights?: string): Promise<void> {
  const key = `${family}|${weights ?? ''}`
  if (loaded.has(key)) return
  if (failed.has(key)) throw new Error(`Font previously failed: ${family}`)

  const primary = buildCssUrl(family, weights, 'fonts.googleapis.com')
  const fallback = buildCssUrl(family, weights, 'fonts.loli.net')

  try {
    await injectLink(primary)
  } catch {
    await injectLink(fallback)
  }

  // Wait for FontFace to actually be usable
  const face = weights
    ? `700 48px "${family}"`
    : `400 48px "${family}"`
  try {
    await document.fonts.load(face)
    // Also try other common weights
    if (weights) {
      for (const w of weights.split(';')) {
        await document.fonts.load(`${w} 48px "${family}"`).catch(() => undefined)
      }
    }
  } catch {
    // fonts.load may fail on some browsers; CSS load is enough
  }

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
