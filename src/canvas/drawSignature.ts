import type { DrawOptions } from '../lib/types'
import { drawBackground } from './backgrounds'

function measureSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  letterSpacing: number,
): number {
  if (!text) return 0
  let width = 0
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width
    if (i < text.length - 1) width += letterSpacing
  }
  return width
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
  mode: 'fill' | 'stroke' = 'fill',
): void {
  let cx = x
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (mode === 'fill') ctx.fillText(ch, cx, y)
    else ctx.strokeText(ch, cx, y)
    cx += ctx.measureText(ch).width + letterSpacing
  }
}

function applySlant(ctx: CanvasRenderingContext2D, slantDeg: number, cx: number, cy: number): void {
  if (!slantDeg) return
  const rad = (slantDeg * Math.PI) / 180
  ctx.translate(cx, cy)
  // shear horizontally
  ctx.transform(1, 0, Math.tan(rad), 1, 0, 0)
  ctx.translate(-cx, -cy)
}

function drawFlourish(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string): void {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.bezierCurveTo(x + w * 0.3, y + 18, x + w * 0.6, y - 14, x + w, y + 4)
  ctx.stroke()
  ctx.restore()
}

function drawTextWithEffect(
  ctx: CanvasRenderingContext2D,
  opts: DrawOptions,
  textX: number,
  textY: number,
  textW: number,
): void {
  const { name, style, color, letterSpacing, slant } = opts
  const effect = style.effect ?? 'none'
  const cx = textX + textW / 2
  const cy = textY

  ctx.save()
  applySlant(ctx, slant + (style.defaultSlant ?? 0), cx, cy)

  switch (effect) {
    case 'emboss': {
      // deep shadow layers
      for (let i = 6; i >= 1; i--) {
        ctx.fillStyle = `rgba(0,0,0,${0.06 + i * 0.04})`
        drawSpacedText(ctx, name, textX + i, textY + i, letterSpacing)
      }
      ctx.fillStyle = color
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      // highlight
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      drawSpacedText(ctx, name, textX - 1, textY - 1, letterSpacing)
      ctx.fillStyle = color
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      break
    }
    case 'blade': {
      ctx.shadowColor = 'rgba(0,0,0,0.55)'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 4
      ctx.fillStyle = color
      // slightly condensed via scale
      ctx.translate(cx, cy)
      ctx.scale(0.88, 1.08)
      ctx.translate(-cx, -cy)
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      break
    }
    case 'creative': {
      const g = ctx.createLinearGradient(textX, textY - 40, textX + textW, textY + 20)
      g.addColorStop(0, '#7c3aed')
      g.addColorStop(0.5, '#db2777')
      g.addColorStop(1, '#ea580c')
      ctx.fillStyle = g
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      drawFlourish(ctx, textX, textY + opts.fontSize * 0.35, textW, '#a855f7')
      break
    }
    case 'outline': {
      ctx.lineWidth = Math.max(2, opts.fontSize * 0.04)
      ctx.strokeStyle = color
      ctx.lineJoin = 'round'
      drawSpacedText(ctx, name, textX, textY, letterSpacing, 'stroke')
      break
    }
    case 'sealred': {
      ctx.fillStyle = '#c41e3a'
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      // faint stamp texture overlay via second lighter pass offset
      ctx.globalAlpha = 0.15
      ctx.fillStyle = '#8b0000'
      drawSpacedText(ctx, name, textX + 1, textY + 1, letterSpacing)
      ctx.globalAlpha = 1
      break
    }
    case 'neon': {
      const neon = color || '#22d3ee'
      ctx.shadowColor = neon
      ctx.shadowBlur = 24
      ctx.fillStyle = neon
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      ctx.shadowBlur = 12
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      ctx.shadowBlur = 0
      ctx.fillStyle = '#ffffff'
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      break
    }
    case 'influencer': {
      ctx.shadowColor = 'rgba(0,0,0,0.25)'
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 3
      ctx.fillStyle = color
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      break
    }
    default: {
      ctx.fillStyle = color
      drawSpacedText(ctx, name, textX, textY, letterSpacing)
      break
    }
  }
  ctx.restore()
}

export function drawSignature(
  canvas: HTMLCanvasElement,
  opts: DrawOptions,
): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const pad = opts.padding
  const fontSize = opts.fontSize
  const spacing =
    opts.letterSpacing + (opts.style.letterSpacing ?? 0)

  // Measure first on an offscreen context
  const measure = document.createElement('canvas').getContext('2d')!
  const weight =
    opts.style.weights?.includes('900')
      ? '900'
      : opts.style.weights?.includes('700')
        ? '700'
        : opts.style.weights?.includes('500')
          ? '500'
          : '400'
  measure.font = `${weight} ${fontSize}px ${opts.style.fontFamily}, sans-serif`
  const textW = measureSpacedText(measure, opts.name, spacing)
  const textH = fontSize * 1.35

  let cssW: number
  let cssH: number

  if (opts.sigType === 'avatar') {
    const side = Math.max(textW, textH) + pad * 2 + fontSize * 0.6
    cssW = opts.width ?? side
    cssH = opts.height ?? side
  } else {
    cssW = opts.width ?? Math.ceil(textW + pad * 2)
    cssH = opts.height ?? Math.ceil(textH + pad * 2)
    // minimum size
    cssW = Math.max(cssW, 200)
    cssH = Math.max(cssH, 100)
  }

  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`

  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  // Clip for avatar circle
  if (opts.sigType === 'avatar') {
    const cx = cssW / 2
    const cy = cssH / 2
    const r = Math.min(cssW, cssH) / 2 - 2
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()
    drawBackground(ctx, opts.bg, cssW, cssH)
    ctx.restore()

    // draw content clipped
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()

    ctx.font = `${weight} ${fontSize}px ${opts.style.fontFamily}, sans-serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const tx = (cssW - textW) / 2
    const ty = cssH / 2
    drawTextWithEffect(ctx, { ...opts, letterSpacing: spacing }, tx, ty, textW)
    ctx.restore()

    if (opts.ring) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.lineWidth = Math.max(3, r * 0.04)
      ctx.strokeStyle = opts.color || '#c41e3a'
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, r - ctx.lineWidth - 2, 0, Math.PI * 2)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'
      ctx.stroke()
    }
  } else {
    drawBackground(ctx, opts.bg, cssW, cssH)
    ctx.font = `${weight} ${fontSize}px ${opts.style.fontFamily}, sans-serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const tx = (cssW - textW) / 2
    const ty = cssH / 2
    drawTextWithEffect(ctx, { ...opts, letterSpacing: spacing }, tx, ty, textW)
  }
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type)
  })
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
): void {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await canvasToBlob(canvas)
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}
