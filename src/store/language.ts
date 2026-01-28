import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  lang: string
  country: string
  setLang: (lang: string) => void
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'in',
      country: 'ID',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'dreamshort-language' }
  )
)

export const languages = [
  { code: 'in', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

export const lockMessages: Record<string, string> = {
  in: 'Website ini hanya trial, jika membutuhkan API cek Telegram @sapitokenbot',
  en: 'This website is trial only, if you need API check Telegram @sapitokenbot',
  th: 'เว็บไซต์นี้เป็นเพียงทดลองใช้ หากคุณต้องการ API ตรวจสอบ Telegram @sapitokenbot',
  es: 'Este sitio web es solo de prueba, si necesita API consulte Telegram @sapitokenbot',
  pt: 'Este site é apenas teste, se você precisa de API verifique Telegram @sapitokenbot',
  fr: "Ce site web est en version d'essai uniquement, si vous avez besoin d'API consultez Telegram @sapitokenbot",
  de: 'Diese Website ist nur Testversion, wenn Sie API benötigen, prüfen Sie Telegram @sapitokenbot',
}
