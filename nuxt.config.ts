// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      siteName: process.env.NUXT_PUBLIC_SITE_NAME,
    },
    geminiApiKey: process.env.NUXT_GEMINI_API
  },


  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  fonts: {
    families: [
      {
        name: 'Public Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
      },
      {
        name: 'IBM Plex Sans',
        provider: 'google',
        weights: [500, 600, 700],
      },
    ],
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' }
    ],
    langDir: 'locales'
  },

  css: [
    '@/assets/css/main.css'
  ]
})
