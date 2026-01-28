import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Film } from 'lucide-react'
import { useSections } from '../hooks'
import { useLanguage } from '../store/language'
import type { Book } from '../types'

const tabs = [
  { id: 0, name: 'For You' },
  { id: 30, name: 'Hot' },
  { id: 31, name: 'New' },
  { id: 32, name: 'Romance' },
  { id: 33, name: 'Revenge' },
  { id: 36, name: 'CEO' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const { sections, loading } = useSections(activeTab)
  const [books, setBooks] = useState<Book[]>([])
  const { lang } = useLanguage()

  useEffect(() => {
    const fetchBooks = async () => {
      const ids = sections.flatMap(s => s.contents.map(c => c.id)).slice(0, 18)
      const uniqueIds = [...new Set(ids)]
      const results = await Promise.all(
        uniqueIds.map(async id => {
          try {
            const res = await fetch(`/api/book/getBookDetail?bid=${id}&lang=${lang}`)
            const data = await res.json()
            return data.book
          } catch { return null }
        })
      )
      setBooks(results.filter(Boolean))
    }
    if (sections.length) fetchBooks()
  }, [sections, lang])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Featured */}
      {books[0] && (
        <Link to={`/watch/${books[0].id}`} className="block">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-800">
            {books[0].cover ? (
              <img src={books[0].cover} alt={books[0].name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film size={48} className="text-zinc-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                {tabs.find(t => t.id === activeTab)?.name}
              </div>
              <h2 className="text-xl font-bold mb-2 line-clamp-2">{books[0].name}</h2>
              <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{books[0].description}</p>
              <div className="btn-primary inline-flex items-center gap-2">
                <Play size={16} /> Watch Now
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {books.slice(1).map(book => (
          <Link key={book.id} to={`/watch/${book.id}`} className="group">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-zinc-800">
              {book.cover ? (
                <img src={book.cover} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film size={32} className="text-zinc-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={20} className="text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium line-clamp-2">{book.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
