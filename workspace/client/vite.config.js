import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Student Budget Tracker & Learning Platform',
        short_name: 'StudentLearn',
        description: 'Track budgets and learn finance & tech skills',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/vite.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
        ]
      }
    })
  ]
})
