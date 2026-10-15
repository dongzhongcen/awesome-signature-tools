interface Props {
  value: string
  onChange: (v: string) => void
  error?: string
}

const NAME_RE = /^[\u4e00-\u9fffA-Za-z·\u00b7\s]{0,12}$/

export function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return '请输入姓名'
  if (trimmed.length < 1 || trimmed.length > 12) return '姓名长度需为 1–12 个字符'
  if (!/^[\u4e00-\u9fffA-Za-z·\u00b7\s]{1,12}$/.test(trimmed)) {
    return '仅支持中文、英文字母'
  }
  return null
}

export function NameInput({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">姓名</label>
      <input
        type="text"
        value={value}
        maxLength={12}
        placeholder="输入姓名，如：张三"
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-lg
          focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400
          bg-white placeholder:text-gray-400"
        onChange={(e) => {
          const v = e.target.value
          if (NAME_RE.test(v) || v === '') onChange(v)
        }}
      />
      <div className="flex justify-between mt-1 text-xs">
        <span className="text-red-600">{error || '\u00a0'}</span>
        <span className="text-gray-400">{value.trim().length}/12</span>
      </div>
    </div>
  )
}
