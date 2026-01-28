import { Link } from 'react-router-dom'
import { Play, Film } from 'lucide-react'

interface Props {
  id: number | string
  name: string
  cover: string
}

export default function DramaCard({ id, name, cover }: Props) {
  return (
    <Link to={`/watch/${id}`} className="group">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-zinc-800">
        {cover ? (
          <img src={cover} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={e => e.currentTarget.style.display = 'none'} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film size={32} className="text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play size={20} className="text-white" />
        </div>
      </div>
      <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
    </Link>
  )
}
