export function Header() {
  return (
    <header className="text-center pt-6 pb-4 px-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" className="w-12 h-12 sm:w-14 sm:h-14" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          在线免费生成电子签名
        </h1>
      </div>
      <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
        纯前端 Canvas · 多字体多效果 · 无水印 · 本地生成
      </p>
    </header>
  )
}
