import { useEffect, useRef } from 'react'
import { drawSignature } from '../canvas/drawSignature'
import { getStyle, MULTI_STYLES } from '../lib/styles'
import type { BgType, DrawOptions, SigType, StyleId } from '../lib/types'

interface Props {
  name: string
  bg: BgType
  sigType: SigType
  color: string
  fontSize: number
  letterSpacing: number
  slant: number
  padding: number
  ring: boolean
  fontsReady: boolean
  active: boolean
  onPick: (id: StyleId) => void
}

function MiniCard({
  styleId,
  base,
  fontsReady,
  onPick,
}: {
  styleId: StyleId
  base: Omit<DrawOptions, 'style'>
  fontsReady: boolean
  onPick: (id: StyleId) => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const style = getStyle(styleId)

  useEffect(() => {
    if (!ref.current || !fontsReady || !base.name.trim()) return
    const color = style.defaultColor ?? base.color
    drawSignature(ref.current, {
      ...base,
      style,
      color,
      fontSize: Math.min(base.fontSize, 64),
      padding: Math.min(base.padding, 24),
      width: base.sigType === 'avatar' ? 140 : 220,
      height: base.sigType === 'avatar' ? 140 : 90,
    })
  }, [base, style, fontsReady])

  return (
    <button
      type="button"
      onClick={() => onPick(styleId)}
      className="card !p-3 text-left hover:ring-2 hover:ring-red-400/50 transition-all"
    >
      <div className="text-xs font-medium text-gray-500 mb-2">{style.label}</div>
      <div className="preview-checker rounded-lg flex items-center justify-center min-h-[90px] p-2">
        <canvas ref={ref} className="max-w-full h-auto" />
      </div>
    </button>
  )
}

export function MultiGenerate({
  name,
  bg,
  sigType,
  color,
  fontSize,
  letterSpacing,
  slant,
  padding,
  ring,
  fontsReady,
  active,
  onPick,
}: Props) {
  if (!active) return null

  const base: Omit<DrawOptions, 'style'> = {
    name: name.trim(),
    bg,
    sigType,
    color,
    fontSize,
    letterSpacing,
    slant,
    padding,
    ring,
  }

  return (
    <div className="card">
      <h2 className="text-base font-semibold text-gray-800 mb-3">一键生成多款</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MULTI_STYLES.map((id) => (
          <MiniCard key={id} styleId={id} base={base} fontsReady={fontsReady} onPick={onPick} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">点击卡片可切换为该风格并下载</p>
    </div>
  )
}
