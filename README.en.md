<div align="center">

<img src="public/logo.svg" alt="Logo" width="96" height="96" />

# Online Free E-Signature Generator

**Client-side Canvas e-signature image generator with many fonts & effects — local only, no watermark**

*Multi-style fonts · Paper / seal backgrounds · Avatar crop · Batch styles · PNG download*

[简体中文](./README.md) · [Live Demo](https://dongzhongcen.github.io/awesome-signature-tools/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
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

Fonts are **SIL Open Font License (OFL)** families from Google Fonts; emboss / outline / neon / etc. are Canvas effects. See [fonts/NOTICE](./fonts/NOTICE).

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
- GitHub Actions → GitHub Pages

## Fonts & licenses

This repo does **not** ship font binaries. The browser loads these OFL families from Google Fonts (with a `fonts.loli.net` fallback) at runtime:

Ma Shan Zheng · Zhi Mang Xing · Liu Jian Mao Cao · Long Cang · ZCOOL XiaoWei · ZCOOL QingKe HuangYou · Noto Serif SC · Noto Sans SC

Full details: [fonts/NOTICE](./fonts/NOTICE). Application code is [MIT](./LICENSE).

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

Production base path is `/awesome-signature-tools/` (see `base` in `vite.config.ts`).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages.

Live site: https://dongzhongcen.github.io/awesome-signature-tools/

## License

[MIT](./LICENSE) © dongzhongcen
