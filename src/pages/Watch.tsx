import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, Film } from 'lucide-react'
import { useBookDetail, useChapters } from '../hooks'
import { useLanguage, lockMessages } from '../store/language'

export default function Watch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { book, loading: bookLoading } = useBookDetail(id!)
  const { chapters, loading: chaptersLoading } = useChapters(id!)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoLoading, setVideoLoading] = useState(false)
  const [showLockPopup, setShowLockPopup] = useState(false)
  const { lang } = useLanguage()

  useEffect(() => {
    if (!chapters.length) return
    
    const fetchVideo = async () => {
      if (currentEpisode >= 30) {
        setShowLockPopup(true)
        return
      }
      
      setVideoLoading(true)
      try {
        const chapter = chapters[currentEpisode - 1]
        if (!chapter) return
        
        const res = await fetch(`/api/book/getChapterDetail?bid=${id}&chapterResourceId=${chapter.id}&lang=${lang}`)
        const data = await res.json()
        
        if (data.message === 'ok') {
          setVideoUrl(data.chapter.bookChapterResource.normalSourceUrl)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setVideoLoading(false)
      }
    }
    fetchVideo()
  }, [chapters, currentEpisode, id, lang])

  const handleEpisodeChange = (ep: number) => {
    if (ep >= 30) {
      setShowLockPopup(true)
      return
    }
    setCurrentEpisode(ep)
  }

  const handleVideoEnded = () => {
    if (currentEpisode < chapters.length) {
      handleEpisodeChange(currentEpisode + 1)
    }
  }

  if (bookLoading || chaptersLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Drama tidak ditemukan</p>
          <button onClick={() => navigate('/')} className="btn-primary">Kembali</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center h-16 px-4 max-w-md mx-auto">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-zinc-800 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold line-clamp-1 flex-1 mx-4">{book.name}</h1>
        </div>
      </div>

      {/* Video */}
      <div className="pt-16">
        <div className="relative bg-black">
          {videoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full" />
            </div>
          )}
          <video
            key={videoUrl}
            src={videoUrl}
            poster={book.cover || undefined}
            controls
            autoPlay
            playsInline
            onEnded={handleVideoEnded}
            className="w-full aspect-[9/16] object-contain bg-black"
          />
        </div>

        {/* Content */}
        <div className="p-4 max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-2">{book.name}</h2>
            <p className="text-sm text-zinc-400 mb-3">Episode {currentEpisode} of {chapters.length}</p>
            <p className="text-sm text-zinc-300 line-clamp-3">{book.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => handleEpisodeChange(currentEpisode - 1)}
              disabled={currentEpisode <= 1}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} /> Sebelumnya
            </button>
            <button
              onClick={() => handleEpisodeChange(currentEpisode + 1)}
              disabled={currentEpisode >= chapters.length}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg flex items-center justify-center gap-2 text-white font-medium"
            >
              Selanjutnya <ChevronRight size={18} />
            </button>
          </div>

          {/* Episode List */}
          <div>
            <h3 className="font-semibold mb-3">Semua Episode</h3>
            <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
              {chapters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleEpisodeChange(i + 1)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    currentEpisode === i + 1 ? 'bg-red-500 text-white scale-105' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lock Popup */}
        {showLockPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} className="text-red-500" />
              </div>
              <p className="text-white mb-6 whitespace-pre-line">{lockMessages[lang] || lockMessages.en}</p>
              <div className="flex gap-2">
                <button onClick={() => setShowLockPopup(false)} className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-medium hover:bg-zinc-700">
                  OK
                </button>
                <a href="https://t.me/sapitokenbot" target="_blank" rel="noopener noreferrer" className="flex-1 btn-primary py-3 rounded-lg font-medium text-center">
                  Telegram
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
