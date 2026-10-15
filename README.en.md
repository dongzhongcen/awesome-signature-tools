<div align="center">

<img src="public/logo.svg" alt="Logo" width="96" height="96" />

# Online Free E-Signature Generator

**Client-side Canvas e-signature image generator with many fonts & effects — local only, no watermark**

*Multi-style fonts · Paper / seal backgrounds · Avatar crop · Batch styles · PNG download*

[简体中文](./README.md) · [Mainland China](https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html) · [International / GitHub Pages](https://dongzhongcen.github.io/awesome-signature-tools/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![China CDN](https://img.shields.io/badge/China-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://dongzhongcen.github.io/awesome-signature-tools/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Disclaimer

Images produced by this tool are **decorative artistic signatures only**. They are **not** reliable electronic signatures under China’s Electronic Signature Law (or equivalent e-sign regimes).

**Do not** use them for contracts, banking, government filings, or any legally binding signing. Use a qualified electronic authentication service when legal effect is required.

## Privacy

Your name and signature image are rendered **locally in the browser** via Canvas and are **never uploaded to any server**. There is no backend, no API, no analytics, and no ads.

## Mainland China access

GitHub Pages is often unreachable from mainland China. This repo also publishes a **relative-path** build to the `cdn` branch for jsDelivr:

- **Primary China URL (jsDelivr)**: https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html
- Mirrors: https://fastly.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html · https://gcore.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html
- **International / GitHub Pages**: https://dongzhongcen.github.io/awesome-signature-tools/

**Fonts are self-hosted** under `public/fonts/` (OFL woff2) and loaded same-origin — **no** Google Fonts or third-party font CDN. Your name and signature stay local in the browser and are never uploaded.

- **Lazy-load**: first paint loads only the default brush face + UI Noto Sans SC; other styles load on chip select or batch generate.
- **Name subset**: display fonts are subset to ~2.2k common name CJK + Latin/punct.
### Offline use

When the CDN or GitHub Pages is blocked, use the offline zip (no Node required):

1. Open the [v1.1.0-fonts Release](https://github.com/dongzhongcen/awesome-signature-tools/releases/tag/v1.1.0-fonts) and download `offline-signature-generator.zip`
2. Unzip it anywhere
3. **Double-click `index.html`** to open it in a browser

Fonts live under `./fonts/` and load locally. If the browser blocks local scripts, run `python3 -m http.server` in the unzipped folder and open the local URL it prints. See `OFFLINE.txt` in the zip for details.

## Overview

**Online Free E-Signature Generator** (repo: `awesome-signature-tools`) runs entirely in the browser. Enter a name, pick a style and background, preview, then download a PNG — **with zero watermark on the bitmap**.

## Features

### Signature styles (16)

| Style | Description |
|-------|-------------|
| Brush (毛笔签) | Calligraphy brush font |
| Running script (行书签) | Semi-cursive style |
| Cursive (草书签) | Cursive style |
| Handwritten (手写签) | Casual handwriting |
| XiaoWei (小薇签) | Clean display face |
| HuangYou (黄油签) | Rounded playful face |
| Formal serif (严肃签) | Serif formal look |
| Official sans (公务签) | Sans document look |
| Emboss 3D (立体字) | Multi-layer emboss / shadow |
| Blade (刀锋体) | Condensed skew + sharp shadow |
| Creative (创意签) | Gradient fill + flourish |
| Soft pink (少女签) | Rounded face + pink default ink |
| Bold brush (网红签) | Bold brush + tight tracking |
| Outline (描边签) | Hollow stroke |
| Seal red (印章红) | Vermilion seal look |
| Neon (霓虹签) | Glow neon effect |

Fonts are **SIL Open Font License (OFL)** faces that originated from the Google Fonts catalog and are self-hosted as woff2 in this repo; emboss / outline / neon / etc. are Canvas effects. See [fonts/NOTICE](./fonts/NOTICE).

### Backgrounds

Transparent · White · Xuan paper texture · Light gray paper · Red seal circle · Color gradient · Grid paper

(All procedural Canvas drawing — no third-party image assets.)

### More

- **Type**: normal signature / circular avatar (optional ring)
- **Live preview** + “generate multiple styles” grid (~6)
- **Controls**: ink color, size, letter-spacing, slant, padding
- **Export**: download PNG (keeps alpha when background is transparent), copy to clipboard
- Filename example: `签名-张三-毛笔签.png`
- Mobile-friendly · Simplified Chinese UI

## Tech

- Vite + React + TypeScript
- Tailwind CSS
- HTML Canvas (fully client-side)
- GitHub Actions → GitHub Pages + `cdn` branch (jsDelivr)

## Fonts & licenses

This repo **self-hosts** chinese-simplified OFL woff2 subsets under `public/fonts/` (FontFace, same-origin — no external font requests):

Ma Shan Zheng · Zhi Mang Xing · Liu Jian Mao Cao · Long Cang · ZCOOL XiaoWei · ZCOOL QingKe HuangYou · Noto Serif SC · Noto Sans SC

Full details: [fonts/NOTICE](./fonts/NOTICE). Application code is [MIT](./LICENSE).

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build          # GitHub Pages (base: /awesome-signature-tools/)
npm run build:cdn      # Portable CDN (base: ./ for jsDelivr)
npm run preview
```

Default `base` is `/awesome-signature-tools/`; set `VITE_BASE=./` (or run `build:cdn`) for relative asset paths suitable for jsDelivr.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which:

1. Builds and deploys to **GitHub Pages**
2. Rebuilds with relative paths and force-updates the **`cdn` branch** (for jsDelivr)

- China: https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html
- International: https://dongzhongcen.github.io/awesome-signature-tools/

## License

[MIT](./LICENSE) © dongzhongcen
