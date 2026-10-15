interface Props {
  loading: boolean
  progress: number
  total: number
  failed: string[]
}

export function FontLoading({ loading, progress, total, failed }: Props) {
  if (!loading && failed.length === 0) return null
  const pct = total ? Math.round((progress / total) * 100) : 0
  return (
    <div className="card !py-3 !px-4 mb-4">
      {loading ? (
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600">正在加载字体…</span>
            <span className="text-gray-400 tabular-nums">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : failed.length > 0 ? (
        <p className="text-sm text-amber-700">
          部分字体加载失败（{failed.join('、')}），对应风格可能回退到系统字体。
        </p>
      ) : null}
    </div>
  )
}
