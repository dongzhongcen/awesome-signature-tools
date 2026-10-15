import { useEffect, useRef } from 'react'
import { drawSignature } from '../canvas/drawSignature'
import type { DrawOptions } from '../lib/types'

interface Props {
  options: DrawOptions | null
  fontsReady: boolean
}

export function Preview({ options, fontsReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !options || !fontsReady || !options.name.trim()) {
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = 400
          canvas.height = 160
          canvas.style.width = '400px'
          canvas.style.height = '160px'
          ctx.clearRect(0, 0, 400, 160)
        }
      }
      return
    }
    drawSignature(canvas, options)
  }, [options, fontsReady])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">实时预览</label>
      <div
        className={`preview-checker rounded-xl overflow-auto flex items-center justify-center min-h-[160px] p-4 border border-gray-100 ${
          options?.sigType === 'avatar' ? 'rounded-full max-w-[280px] mx-auto aspect-square' : ''
        }`}
      >
        {!fontsReady ? (
          <p className="text-gray-400 text-sm animate-pulse">字体加载中…</p>
        ) : !options?.name.trim() ? (
          <p className="text-gray-400 text-sm">输入姓名后显示预览</p>
        ) : (
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        )}
      </div>
    </div>
  )
}
