import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Film } from 'lucide-react'
import { useSections } from '../hooks'
import { useLanguage } from '../store/language'
import type { Book } from '../types'

const categories = [
  { id: 32, name: 'Romance' },
  { id: 33, name: 'Revenge' },
  { id: 36, name: 'CEO' },
  { id: 30, name: 'Hot' },
  { id: 31, name: 'New' },
]

export default function Category() {
  const [activeCategory, setActiveCategory] = useState(32)
  const { sections, loading } = useSections(activeCategory)
  const [books, setBooks] = useState<Book[]>([])
  const { lang } = useLanguage()

  useEffect(() => {
    const fetchBooks = async () => {
      const ids = sections.flatMap(s => s.contents.map(c => c.id)).slice(0, 12)
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

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {books.map(book => (
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
      )}
    </div>
  )
}
