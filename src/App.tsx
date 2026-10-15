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
import {
  findMissingGlyphs,
  isStyleFontReady,
  loadInitialFonts,
  loadStyleFonts,
  loadStylesFonts,
} from './lib/fonts'
import { getStyle, MULTI_STYLES } from './lib/styles'
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
  const [initialReady, setInitialReady] = useState(false)
  const [fontLoading, setFontLoading] = useState(true)
  const [fontProgress, setFontProgress] = useState(0)
  const [fontTotal, setFontTotal] = useState(1)
  const [fontFailed, setFontFailed] = useState<string[]>([])
  const [styleLoading, setStyleLoading] = useState(false)
  const [loadingStyleId, setLoadingStyleId] = useState<StyleId | null>(null)
  const [multiLoading, setMultiLoading] = useState(false)
  const [missingTip, setMissingTip] = useState(false)
  const exportRef = useRef<HTMLCanvasElement>(null)

  // Initial: only Ma Shan Zheng + Noto Sans SC 400
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setFontLoading(true)
      setFontProgress(0)
      setFontTotal(2)
      const result = await loadInitialFonts()
      if (!cancelled) {
        setFontFailed(result.failed)
        setFontProgress(2)
        setInitialReady(true)
        setFontLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const style = useMemo(() => getStyle(styleId), [styleId])

  // Load font when style chip changes
  useEffect(() => {
    if (!initialReady) return
    if (isStyleFontReady(style)) {
      setStyleLoading(false)
      setLoadingStyleId(null)
      return
    }
    let cancelled = false
    setStyleLoading(true)
    setLoadingStyleId(styleId)
    ;(async () => {
      try {
        await loadStyleFonts(style)
      } catch {
        if (!cancelled) {
          setFontFailed((prev) =>
            prev.includes(style.googleFamily) ? prev : [...prev, style.googleFamily],
          )
        }
      } finally {
        if (!cancelled) {
          setStyleLoading(false)
          setLoadingStyleId(null)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [styleId, style, initialReady])

  // Apply style default color when style changes
  useEffect(() => {
    if (style.defaultColor) {
      setColor(style.defaultColor)
    }
  }, [styleId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Missing glyph tip for current name + style
  useEffect(() => {
    if (!initialReady || styleLoading || !isStyleFontReady(style)) {
      setMissingTip(false)
      return
    }
    const trimmed = name.trim()
    if (!trimmed) {
      setMissingTip(false)
      return
    }
    const weight =
      style.weights?.includes('900')
        ? '900'
        : style.weights?.includes('700')
          ? '700'
          : style.weights?.includes('500')
            ? '500'
            : '400'
    const missing = findMissingGlyphs(style.googleFamily, trimmed, weight)
    setMissingTip(missing.length > 0)
  }, [name, style, styleId, initialReady, styleLoading])

  const nameError = validateName(name)
  const styleReady = initialReady && isStyleFontReady(style) && !styleLoading
  const canGenerate = !nameError && styleReady

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

  const handleMulti = async () => {
    if (multiActive) {
      setMultiActive(false)
      return
    }
    setMultiLoading(true)
    setFontLoading(true)
    setFontProgress(0)
    try {
      await loadStylesFonts(MULTI_STYLES, (done, total) => {
        setFontProgress(done)
        setFontTotal(total)
      })
      setMultiActive(true)
    } finally {
      setMultiLoading(false)
      setFontLoading(false)
    }
  }

  const handleStyleChange = (id: StyleId) => {
    setStyleId(id)
  }

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="max-w-3xl mx-auto px-4 space-y-4">
        <FontLoading
          loading={fontLoading || multiLoading}
          progress={fontProgress}
          total={fontTotal}
          failed={fontFailed}
          label={multiLoading ? '正在加载多款字体…' : undefined}
        />

        <section className="card space-y-5">
          <NameInput value={name} onChange={setName} error={nameError ?? undefined} />
          <StyleChips
            value={styleId}
            onChange={handleStyleChange}
            loadingId={loadingStyleId}
          />
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
          <Preview
            options={canGenerate ? options : null}
            fontsReady={styleReady}
            styleLoading={styleLoading}
            missingGlyphTip={missingTip}
          />
          <DownloadBar
            disabled={!canGenerate}
            onDownload={handleDownload}
            onCopy={handleCopy}
            onMulti={handleMulti}
            copyMsg={copyMsg}
            multiActive={multiActive}
            multiLoading={multiLoading}
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
          fontsReady={multiActive && !multiLoading}
          active={multiActive && !nameError}
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

      <canvas ref={exportRef} className="hidden" aria-hidden />
    </div>
  )
}
