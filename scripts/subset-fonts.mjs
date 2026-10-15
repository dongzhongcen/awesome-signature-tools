#!/usr/bin/env node
/**
 * Rebuild public/fonts/*.woff2 as Chinese personal-name (+ Latin/punct/UI) subsets.
 * Requires: pyftsubset (pip install 'fonttools[woff]' brotli zopfli)
 *
 * Usage: node scripts/subset-fonts.mjs
 * Reads: scripts/name-charset.txt, public/fonts/*.woff2 (full/source)
 * Writes: public/fonts/*.woff2 (replaced in place via temp)
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fontsDir = join(root, 'public', 'fonts')
const charsetPath = join(root, 'scripts', 'name-charset.txt')
const tmp = join(root, '.font-subset-tmp')

if (!existsSync(charsetPath)) {
  console.error('Missing', charsetPath)
  process.exit(1)
}

mkdirSync(tmp, { recursive: true })

const files = readdirSync(fontsDir).filter((f) => f.endsWith('.woff2'))
if (files.length === 0) {
  console.error('No woff2 in', fontsDir, '— run npm run fonts:fetch first')
  process.exit(1)
}

const unicodesFile = join(tmp, 'unicodes.txt')
// pyftsubset --text-file wants raw text; also pass --unicodes for ASCII safety
copyFileSync(charsetPath, join(tmp, 'charset.txt'))

function subsetOne(name) {
  const src = join(fontsDir, name)
  const out = join(tmp, name)
  const before = statSync(src).size
  execFileSync(
    'pyftsubset',
    [
      src,
      `--text-file=${join(tmp, 'charset.txt')}`,
      '--flavor=woff2',
      '--with-zopfli',
      '--layout-features=*',
      '--glyph-names',
      '--symbol-cmap',
      '--legacy-cmap',
      '--notdef-glyph',
      '--notdef-outline',
      '--recommended-glyphs',
      '--name-IDs=*',
      '--name-legacy',
      '--name-languages=*',
      `--output-file=${out}`,
    ],
    { stdio: 'inherit' },
  )
  const after = statSync(out).size
  renameSync(out, src)
  const kb = (n) => `${(n / 1024).toFixed(1)}KB`
  console.log(`${name}: ${kb(before)} → ${kb(after)}`)
  return { name, before, after }
}

const results = []
for (const f of files) {
  console.log('subset', f)
  results.push(subsetOne(f))
}

rmSync(tmp, { recursive: true, force: true })

const totalBefore = results.reduce((s, r) => s + r.before, 0)
const totalAfter = results.reduce((s, r) => s + r.after, 0)
console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`,
)
writeFileSync(
  join(root, 'scripts', 'subset-report.json'),
  JSON.stringify({ totalBefore, totalAfter, results }, null, 2),
)
