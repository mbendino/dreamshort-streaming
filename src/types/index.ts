export interface Book {
  id: number
  name: string
  description: string
  cover: string
  category: string
  chapterNum?: number
  author?: string
}

export interface Section {
  style: number
  contents: { id: string; title?: string }[]
}

export interface Chapter {
  id: number
  name: string
  isFree: boolean
}

export interface ChapterDetail {
  bookChapterResource: {
    id: number
    name: string
    normalSourceUrl: string
    cover: string
    subtitles?: { languageCode: string; languageName: string; subtitlesUrl: string }[]
  }
}
