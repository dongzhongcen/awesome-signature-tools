#!/usr/bin/env node
/**
 * Download OFL chinese-simplified woff2 subsets into public/fonts/.
 * Sources: @fontsource/* packages (SIL OFL, derived from Google Fonts).
 * Upstream family trees: https://github.com/google/fonts/tree/main/ofl/...
 *
 * Usage: node scripts/fetch-fonts.mjs
 */
import { execSync } from 'node:child_process'
import { copyFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dest = join(root, 'public', 'fonts')
const licenseDir = join(root, 'fonts', 'licenses')
const tmp = join(root, '.font-fetch-tmp')

mkdirSync(dest, { recursive: true })
mkdirSync(licenseDir, { recursive: true })
rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp)

const display = [
  ['ma-shan-zheng', 'MaShanZheng-Regular.woff2', 'ma-shan-zheng-chinese-simplified-400-normal.woff2'],
  ['zhi-mang-xing', 'ZhiMangXing-Regular.woff2', 'zhi-mang-xing-chinese-simplified-400-normal.woff2'],
  ['liu-jian-mao-cao', 'LiuJianMaoCao-Regular.woff2', 'liu-jian-mao-cao-chinese-simplified-400-normal.woff2'],
  ['long-cang', 'LongCang-Regular.woff2', 'long-cang-chinese-simplified-400-normal.woff2'],
  ['zcool-xiaowei', 'ZCOOLXiaoWei-Regular.woff2', 'zcool-xiaowei-chinese-simplified-400-normal.woff2'],
  ['zcool-qingke-huangyou', 'ZCOOLQingKeHuangYou-Regular.woff2', 'zcool-qingke-huangyou-chinese-simplified-400-normal.woff2'],
]

function packExtract(pkg) {
  const tgz = execSync(`npm pack ${pkg}`, { cwd: tmp, encoding: 'utf8' }).trim().split('\n').pop()
  execSync(`tar -xzf ${tgz}`, { cwd: tmp })
  return join(tmp, 'package')
}

for (const [pkg, outName, srcName] of display) {
  console.log('fetch', pkg)
  const pkgDir = packExtract(`@fontsource/${pkg}`)
  copyFileSync(join(pkgDir, 'files', srcName), join(dest, outName))
  if (existsSync(join(pkgDir, 'LICENSE'))) {
    copyFileSync(join(pkgDir, 'LICENSE'), join(licenseDir, `OFL-${pkg}.txt`))
  }
  rmSync(join(tmp, 'package'), { recursive: true, force: true })
  for (const f of readdirSync(tmp)) {
    if (f.endsWith('.tgz')) rmSync(join(tmp, f))
  }
}

console.log('fetch noto-sans-sc')
{
  const pkgDir = packExtract('@fontsource/noto-sans-sc')
  for (const w of [400, 500, 700, 900]) {
    copyFileSync(
      join(pkgDir, 'files', `noto-sans-sc-chinese-simplified-${w}-normal.woff2`),
      join(dest, `NotoSansSC-${w}.woff2`),
    )
  }
  copyFileSync(join(pkgDir, 'LICENSE'), join(licenseDir, 'OFL-noto-sans-sc.txt'))
  rmSync(join(tmp, 'package'), { recursive: true, force: true })
  for (const f of readdirSync(tmp)) if (f.endsWith('.tgz')) rmSync(join(tmp, f))
}

console.log('fetch noto-serif-sc')
{
  const pkgDir = packExtract('@fontsource/noto-serif-sc')
  for (const w of [700, 900]) {
    copyFileSync(
      join(pkgDir, 'files', `noto-serif-sc-chinese-simplified-${w}-normal.woff2`),
      join(dest, `NotoSerifSC-${w}.woff2`),
    )
  }
  copyFileSync(join(pkgDir, 'LICENSE'), join(licenseDir, 'OFL-noto-serif-sc.txt'))
  rmSync(join(tmp, 'package'), { recursive: true, force: true })
  for (const f of readdirSync(tmp)) if (f.endsWith('.tgz')) rmSync(join(tmp, f))
}

rmSync(tmp, { recursive: true, force: true })
console.log('Done →', dest)
