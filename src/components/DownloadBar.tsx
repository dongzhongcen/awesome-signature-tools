interface Props {
  disabled: boolean
  onDownload: () => void
  onCopy: () => void
  onMulti: () => void
  copyMsg: string
  multiActive: boolean
  multiLoading?: boolean
}

export function DownloadBar({
  disabled,
  onDownload,
  onCopy,
  onMulti,
  copyMsg,
  multiActive,
  multiLoading,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
      <button type="button" className="btn-primary" disabled={disabled} onClick={onDownload}>
        下载 PNG
      </button>
      <button type="button" className="btn-secondary" disabled={disabled} onClick={onCopy}>
        复制到剪贴板
      </button>
      <button
        type="button"
        className={`btn-secondary ${multiActive ? '!bg-red-50 !border-red-200 !text-red-800' : ''}`}
        disabled={multiLoading || (!multiActive && disabled)}
        onClick={onMulti}
      >
        {multiLoading ? '加载字体中…' : '一键生成多款'}
      </button>
      {copyMsg && <span className="text-sm text-green-700">{copyMsg}</span>}
    </div>
  )
}
