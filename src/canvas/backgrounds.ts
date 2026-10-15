import type { BgType } from '../lib/types'

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: BgType,
  w: number,
  h: number,
): void {
  switch (bg) {
    case 'transparent':
      // leave clear
      break
    case 'white':
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      break
    case 'xuanpaper':
      drawXuanPaper(ctx, w, h)
      break
    case 'graypaper':
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, w, h)
      // subtle fiber
      {
        const rand = seededRandom(42)
        ctx.fillStyle = 'rgba(0,0,0,0.03)'
        for (let i = 0; i < 800; i++) {
          const x = rand() * w
          const y = rand() * h
          ctx.fillRect(x, y, 1 + rand() * 2, 1)
        }
      }
      break
    case 'seal':
      drawSealBg(ctx, w, h)
      break
    case 'gradient':
      {
        const g = ctx.createLinearGradient(0, 0, w, h)
        g.addColorStop(0, '#fef3c7')
        g.addColorStop(0.4, '#fce7f3')
        g.addColorStop(0.7, '#e0e7ff')
        g.addColorStop(1, '#d1fae5')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
      break
    case 'grid':
      drawGrid(ctx, w, h)
      break
  }
}

function drawXuanPaper(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const base = ctx.createLinearGradient(0, 0, w, h)
  base.addColorStop(0, '#f7f1e3')
  base.addColorStop(0.5, '#f3ead6')
  base.addColorStop(1, '#efe4cc')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  const rand = seededRandom(12345)
  // fiber noise
  for (let i = 0; i < 2000; i++) {
    const x = rand() * w
    const y = rand() * h
    const a = 0.02 + rand() * 0.06
    ctx.fillStyle = rand() > 0.5 ? `rgba(120,90,40,${a})` : `rgba(255,255,255,${a})`
    ctx.fillRect(x, y, 1 + rand() * 3, 1)
  }
  // soft blotches
  for (let i = 0; i < 40; i++) {
    const x = rand() * w
    const y = rand() * h
    const r = 20 + rand() * 60
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(180,150,100,${0.04 + rand() * 0.05})`)
    g.addColorStop(1, 'rgba(180,150,100,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawSealBg(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#fff8f5'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.42

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(196, 30, 58, 0.08)'
  ctx.fill()
  ctx.lineWidth = Math.max(4, r * 0.045)
  ctx.strokeStyle = 'rgba(196, 30, 58, 0.55)'
  ctx.stroke()

  // inner thin ring
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2)
  ctx.lineWidth = Math.max(1.5, r * 0.015)
  ctx.strokeStyle = 'rgba(196, 30, 58, 0.35)'
  ctx.stroke()
  ctx.restore()
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  const step = 24
  ctx.strokeStyle = 'rgba(180, 200, 220, 0.55)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0; x <= w; x += step) {
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, h)
  }
  for (let y = 0; y <= h; y += step) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(w, y + 0.5)
  }
  ctx.stroke()
}
