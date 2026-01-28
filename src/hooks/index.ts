import { useState, useEffect } from 'react'
import { useLanguage } from '../store/language'
import type { Book, Section } from '../types'

export const useSections = (tabId: number) => {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const { lang, country } = useLanguage()

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/discover/sections?lang=${lang}&country=${country}&tabId=${tabId}`)
        const data = await res.json()
        if (data.message === 'ok') setSections(data.sections || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [lang, country, tabId])

  return { sections, loading }
}

export const useBookDetail = (id: string) => {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/book/getBookDetail?bid=${id}&lang=${lang}`)
        const data = await res.json()
        if (data.message === 'ok') setBook(data.book)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id, lang])

  return { book, loading }
}

export const useChapters = (bookId: string) => {
  const [chapters, setChapters] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`/api/bookShelf/chapterList?bookResourceId=${bookId}&lang=${lang}`)
        const data = await res.json()
        if (data.message === 'ok') setChapters(data.chapters || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchChapters()
  }, [bookId, lang])

  return { chapters, loading }
}

export const useSearchBooks = (keyword: string) => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const { lang } = useLanguage()

  useEffect(() => {
    if (!keyword.trim()) {
      setBooks([])
      return
    }
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search/books?keyword=${encodeURIComponent(keyword)}&lang=${lang}`)
        const data = await res.json()
        if (data.message === 'ok') {
          // Fetch book details to get covers
          const booksWithCovers = await Promise.all(
            (data.books || []).map(async (book: Book) => {
              if (book.cover) return book
              try {
                const detailRes = await fetch(`/api/book/getBookDetail?bid=${book.id}&lang=${lang}`)
                const detailData = await detailRes.json()
                return { ...book, cover: detailData.book?.cover || '' }
              } catch { return book }
            })
          )
          setBooks(booksWithCovers)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    const debounce = setTimeout(fetchBooks, 300)
    return () => clearTimeout(debounce)
  }, [keyword, lang])

  return { books, loading }
}
