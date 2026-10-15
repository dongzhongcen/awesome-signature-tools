import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { copyCanvasToClipboard, downloadCanvas, drawSignature } from './canvas/drawSignature'
import { BackgroundPicker } from './components/BackgroundPicker'
import { Controls } from './components/Controls'
import { DownloadBar } from './components/DownloadBar'
import { FontLoading } from './components/FontLoading'
import { Header } from './components/Header'
import { MultiGenerate } from './components/MultiGenerate'
import { NameInput, validateName } from './components/NameInput'
import { Preview } from './components/Preview'
import { StyleChips } from './components/StyleChips'
import { TypeToggle } from './components/TypeToggle'
import { loadAllFonts } from './lib/fonts'
import { getStyle } from './lib/styles'
import type { BgType, DrawOptions, SigType, StyleId } from './lib/types'

export default function App() {
  const [name, setName] = useState('张三')
  const [styleId, setStyleId] = useState<StyleId>('mashanzheng')
  const [bg, setBg] = useState<BgType>('transparent')
  const [sigType, setSigType] = useState<SigType>('normal')
  const [ring, setRing] = useState(true)
  const [color, setColor] = useState('#1a1a2e')
  const [fontSize, setFontSize] = useState(72)
  const [letterSpacing, setLetterSpacing] = useState(4)
  const [slant, setSlant] = useState(0)
  const [padding, setPadding] = useState(32)
  const [multiActive, setMultiActive] = useState(false)
  const [copyMsg, setCopyMsg] = useState('')
  const [fontsReady, setFontsReady] = useState(false)
  const [fontLoading, setFontLoading] = useState(true)
  const [fontProgress, setFontProgress] = useState(0)
  const [fontTotal, setFontTotal] = useState(1)
  const [fontFailed, setFontFailed] = useState<string[]>([])
  const exportRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setFontLoading(true)
      const result = await loadAllFonts((done, total) => {
        if (!cancelled) {
          setFontProgress(done)
          setFontTotal(total)
        }
      })
      if (!cancelled) {
        setFontFailed(result.failed)
        setFontsReady(true)
        setFontLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const style = useMemo(() => getStyle(styleId), [styleId])

  // Apply style default color when style changes (girl / neon / seal)
  useEffect(() => {
    if (style.defaultColor) {
      setColor(style.defaultColor)
    }
  }, [styleId]) // eslint-disable-line react-hooks/exhaustive-deps

  const nameError = validateName(name)
  const canGenerate = !nameError && fontsReady

  const options: DrawOptions | null = useMemo(() => {
    if (!name.trim()) return null
    return {
      name: name.trim(),
      style,
      bg,
      sigType,
      color,
      fontSize,
      letterSpacing,
      slant,
      padding,
      ring,
    }
  }, [name, style, bg, sigType, color, fontSize, letterSpacing, slant, padding, ring])

  const buildFilename = useCallback(() => {
    const safe = name.trim().replace(/[\\/:*?"<>|]/g, '') || '签名'
    return `签名-${safe}-${style.label}.png`
  }, [name, style.label])

  const ensureExportCanvas = useCallback(() => {
    if (!options || !exportRef.current) return null
    drawSignature(exportRef.current, options)
    return exportRef.current
  }, [options])

  const handleDownload = () => {
    const c = ensureExportCanvas()
    if (!c) return
    downloadCanvas(c, buildFilename())
  }

  const handleCopy = async () => {
    const c = ensureExportCanvas()
    if (!c) return
    try {
      await copyCanvasToClipboard(c)
      setCopyMsg('已复制到剪贴板')
      setTimeout(() => setCopyMsg(''), 2000)
    } catch {
      setCopyMsg('复制失败，请改用下载')
      setTimeout(() => setCopyMsg(''), 2500)
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="max-w-3xl mx-auto px-4 space-y-4">
        <FontLoading
          loading={fontLoading}
          progress={fontProgress}
          total={fontTotal}
          failed={fontFailed}
        />

        <section className="card space-y-5">
          <NameInput value={name} onChange={setName} error={nameError ?? undefined} />
          <StyleChips value={styleId} onChange={setStyleId} />
          <BackgroundPicker value={bg} onChange={setBg} />
          <TypeToggle
            value={sigType}
            ring={ring}
            onChange={setSigType}
            onRingChange={setRing}
          />
          <Controls
            color={color}
            fontSize={fontSize}
            letterSpacing={letterSpacing}
            slant={slant}
            padding={padding}
            onColor={setColor}
            onFontSize={setFontSize}
            onLetterSpacing={setLetterSpacing}
            onSlant={setSlant}
            onPadding={setPadding}
          />
        </section>

        <section className="card space-y-4">
          <Preview options={canGenerate ? options : null} fontsReady={fontsReady} />
          <DownloadBar
            disabled={!canGenerate}
            onDownload={handleDownload}
            onCopy={handleCopy}
            onMulti={() => setMultiActive((v) => !v)}
            copyMsg={copyMsg}
            multiActive={multiActive}
          />
        </section>

        <MultiGenerate
          name={name}
          bg={bg}
          sigType={sigType}
          color={color}
          fontSize={fontSize}
          letterSpacing={letterSpacing}
          slant={slant}
          padding={padding}
          ring={ring}
          fontsReady={fontsReady}
          active={multiActive && canGenerate}
          onPick={(id) => {
            setStyleId(id)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />

        <footer className="text-center text-xs text-gray-500 pt-4 pb-8 space-y-2 max-w-2xl mx-auto">
          <p className="text-gray-400">纯客户端生成 · 姓名仅在浏览器本地渲染，绝不上传服务器 · 无水印 · 无广告</p>
          <p className="leading-relaxed text-amber-800/90 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            <strong>免责声明：</strong>
            本工具生成的仅为装饰性艺术签名图片，<strong>不构成</strong>符合《中华人民共和国电子签名法》的可靠电子签名或电子签章。
            请勿用于合同、银行、政务或其他具有法律效力的签署场景。
          </p>
          <p>
            <a
              className="underline hover:text-gray-600"
              href="https://github.com/dongzhongcen/awesome-signature-tools"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            {' · '}
            MIT License
            {' · '}
            <a
              className="underline hover:text-gray-600"
              href="https://github.com/dongzhongcen/awesome-signature-tools/blob/main/fonts/NOTICE"
              target="_blank"
              rel="noreferrer"
            >
              字体许可
            </a>
          </p>
        </footer>
      </main>

      {/* Hidden export canvas */}
      <canvas ref={exportRef} className="hidden" aria-hidden />
    </div>
  )
}
