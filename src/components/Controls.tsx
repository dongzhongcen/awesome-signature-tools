interface Props {
  color: string
  fontSize: number
  letterSpacing: number
  slant: number
  padding: number
  onColor: (v: string) => void
  onFontSize: (v: number) => void
  onLetterSpacing: (v: number) => void
  onSlant: (v: number) => void
  onPadding: (v: number) => void
}

export function Controls({
  color,
  fontSize,
  letterSpacing,
  slant,
  padding,
  onColor,
  onFontSize,
  onLetterSpacing,
  onSlant,
  onPadding,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">墨色</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => onColor(e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
          />
          <div className="flex gap-1.5 flex-wrap">
            {['#1a1a2e', '#c41e3a', '#1e3a8a', '#166534', '#7c3aed', '#ec4899', '#ea580c'].map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  className="w-7 h-7 rounded-full border-2 border-white shadow ring-1 ring-gray-200"
                  style={{ background: c }}
                  onClick={() => onColor(c)}
                  aria-label={c}
                />
              ),
            )}
          </div>
        </div>
      </div>

      <Slider label="字号" value={fontSize} min={32} max={160} onChange={onFontSize} suffix="px" />
      <Slider label="字距" value={letterSpacing} min={-20} max={40} onChange={onLetterSpacing} suffix="px" />
      <Slider label="倾斜" value={slant} min={-30} max={30} onChange={onSlant} suffix="°" />
      <Slider label="边距" value={padding} min={8} max={80} onChange={onPadding} suffix="px" />
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  suffix: string
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500 tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
