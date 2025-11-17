'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      supportedLngs: ["en", "hi", "ta", "kn", "te"],
      // lng: 'en',
      // debug: true,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/translation.json' // Path to translations
      },
      detection: {
        order: ["localStorage", "navigator"], // 1. load saved choice 2. system/browser
        caches: ["localStorage"],             // save choice
      },
    })
}
export default i18n
