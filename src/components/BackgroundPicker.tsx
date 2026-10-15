import { BACKGROUNDS } from '../lib/styles'
import type { BgType } from '../lib/types'

interface Props {
  value: BgType
  onChange: (id: BgType) => void
}

export function BackgroundPicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">背景效果</label>
      <div className="flex flex-wrap gap-2">
        {BACKGROUNDS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`chip ${value === b.id ? 'chip-active' : ''}`}
            onClick={() => onChange(b.id)}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
