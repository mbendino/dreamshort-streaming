import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage, languages } from '../../store/language'

export default function Header() {
  const [showLang, setShowLang] = useState(false)
  const { lang, setLang } = useLanguage()
  const currentLang = languages.find(l => l.code === lang)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold text-red-500">DreamShort</h1>
        <div className="relative">
          <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800">
            <Globe size={18} />
            <span>{currentLang?.flag}</span>
          </button>
          {showLang && (
            <div className="absolute right-0 top-12 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 py-2 min-w-[150px]">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLang(false) }}
                  className={`w-full px-4 py-2 text-left hover:bg-zinc-800 flex items-center gap-2 ${lang === l.code ? 'text-red-500' : ''}`}
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
