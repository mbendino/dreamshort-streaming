import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { useSearchBooks } from '../hooks'
import DramaCard from '../components/drama/DramaCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const { books, loading } = useSearchBooks(query)

  return (
    <div className="space-y-6 pt-2">
      <div className="relative">
        <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search dramas..."
          className="w-full bg-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {books.map(book => (
            <DramaCard key={book.id} id={book.id} name={book.name} cover={book.cover} />
          ))}
        </div>
      )}

      {!loading && query && books.length === 0 && (
        <p className="text-center text-zinc-400 py-12">No results found</p>
      )}
    </div>
  )
}
