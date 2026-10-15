import type { SigType } from '../lib/types'

interface Props {
  value: SigType
  ring: boolean
  onChange: (t: SigType) => void
  onRingChange: (v: boolean) => void
}

export function TypeToggle({ value, ring, onChange, onRingChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          className={`chip ${value === 'normal' ? 'chip-active' : ''}`}
          onClick={() => onChange('normal')}
        >
          普通签名
        </button>
        <button
          type="button"
          className={`chip ${value === 'avatar' ? 'chip-active' : ''}`}
          onClick={() => onChange('avatar')}
        >
          签名头像
        </button>
        {value === 'avatar' && (
          <label className="inline-flex items-center gap-1.5 text-sm text-gray-600 ml-1 cursor-pointer">
            <input
              type="checkbox"
              checked={ring}
              onChange={(e) => onRingChange(e.target.checked)}
              className="rounded border-gray-300 text-red-700 focus:ring-red-500"
            />
            圆形描边
          </label>
        )}
      </div>
    </div>
  )
}
