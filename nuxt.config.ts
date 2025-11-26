// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  
  css: ['~/assets/css/main.css'],
  
  app: {
    head: {
      title: 'Disha - MSME Bookkeeping',
      meta: [
        { name: 'description', content: 'Simple bookkeeping and credit scoring for MSMEs' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'theme-color', content: '#002060' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  }
})