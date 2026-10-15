import { STYLES } from '../lib/styles'
import type { StyleId } from '../lib/types'

interface Props {
  value: StyleId
  onChange: (id: StyleId) => void
}

export function StyleChips({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">签名风格</label>
      <div className="flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip ${value === s.id ? 'chip-active' : ''}`}
            onClick={() => onChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
