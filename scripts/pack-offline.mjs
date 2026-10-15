#!/usr/bin/env node
/**
 * Post-process dist/ from `npm run build:cdn` into a file://-friendly package:
 * - Bundle JS as classic IIFE (no type=module)
 * - Inline CSS into <style>
 * - Keep fonts/logo/favicon as relative ./ paths
 *
 * Usage: node scripts/pack-offline.mjs
 */
import * as esbuild from 'esbuild'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
  cpSync,
} from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run npm run build:cdn first')
  process.exit(1)
}

const assetsDir = join(dist, 'assets')
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : []
const jsFile = assetFiles.find((f) => f.endsWith('.js'))
const cssFile = assetFiles.find((f) => f.endsWith('.css'))

if (!jsFile) {
  console.error('No JS bundle in dist/assets')
  process.exit(1)
}

const jsPath = join(assetsDir, jsFile)
const css = cssFile ? readFileSync(join(assetsDir, cssFile), 'utf8') : ''

const iifeOut = join(dist, 'app.iife.js')
await esbuild.build({
  entryPoints: [jsPath],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2018'],
  outfile: iifeOut,
  logLevel: 'warning',
  // Already bundled by Vite; just re-wrap. Allow any leftover imports to resolve.
  allowOverwrite: true,
})

let iife = readFileSync(iifeOut, 'utf8')
// Escape </script> in source
iife = iife.replace(/<\/script/gi, '<\\/script')

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="在线免费生成电子签名 · 纯前端 Canvas，无水印，多字体多效果" />
    <title>在线免费生成电子签名</title>
    <style>${css}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${iife}</script>
  </body>
</html>
`

writeFileSync(join(dist, 'index.html'), html)
rmSync(iifeOut, { force: true })
// Remove hashed assets (inlined); keep fonts / svgs
if (existsSync(assetsDir)) rmSync(assetsDir, { recursive: true, force: true })

// Write OFFLINE.txt into dist
writeFileSync(
  join(dist, 'OFFLINE.txt'),
  `离线打开 / Offline
==================

推荐：解压后直接双击 index.html（file://）即可使用。
字体位于 ./fonts/，与页面相对路径加载，无需网络。

若浏览器拦截本地脚本（少见），可在本目录启动本地服务：

  python3 -m http.server 8080

然后访问 http://127.0.0.1:8080/

首次打开仅加载默认毛笔签 + 界面字体；切换风格时再按需加载。
`,
  'utf8',
)

const fontsSize = existsSync(join(dist, 'fonts'))
  ? readdirSync(join(dist, 'fonts'))
      .filter((f) => f.endsWith('.woff2'))
      .reduce((s, f) => s + statSync(join(dist, 'fonts', f)).size, 0)
  : 0

console.log('Offline pack ready:', dist)
console.log('index.html bytes:', statSync(join(dist, 'index.html')).size)
console.log('fonts total:', `${(fontsSize / 1024 / 1024).toFixed(2)}MB`)
