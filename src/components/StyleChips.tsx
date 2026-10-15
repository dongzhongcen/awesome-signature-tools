import { STYLES } from '../lib/styles'
import type { StyleId } from '../lib/types'

interface Props {
  value: StyleId
  onChange: (id: StyleId) => void
  loadingId?: StyleId | null
}

export function StyleChips({ value, onChange, loadingId }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">签名风格</label>
      <div className="flex flex-wrap gap-2">
        {STYLES.map((s) => {
          const loading = loadingId === s.id
          return (
            <button
              key={s.id}
              type="button"
              className={`chip ${value === s.id ? 'chip-active' : ''} ${loading ? 'opacity-70' : ''}`}
              onClick={() => onChange(s.id)}
              disabled={loading && value === s.id}
            >
              {s.label}
              {loading ? <span className="ml-1 inline-block animate-pulse">…</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
