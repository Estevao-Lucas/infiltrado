import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import {
  APP_NAME,
  APP_EMOJI,
  APP_DESCRIPTION,
  APP_THEME_COLORS,
  THEME_STORAGE_KEY,
} from './src/config/app.ts'

// Injeta os metadados de src/config/app.ts nos placeholders %X% do index.html,
// mantendo o nome do app definido em um único lugar.
function appMetadataPlugin(): Plugin {
  return {
    name: 'app-metadata',
    transformIndexHtml(html) {
      return html
        .replaceAll('%APP_NAME%', APP_NAME)
        .replaceAll('%APP_EMOJI%', APP_EMOJI)
        .replaceAll('%APP_DESCRIPTION%', APP_DESCRIPTION)
        .replaceAll('%APP_THEME_COLOR%', APP_THEME_COLORS.dark)
        .replaceAll('%THEME_STORAGE_KEY%', THEME_STORAGE_KEY)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    appMetadataPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-96.png', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: APP_NAME,
        short_name: APP_NAME,
        description: APP_DESCRIPTION,
        lang: 'pt-BR',
        display: 'standalone',
        orientation: 'portrait',
        background_color: APP_THEME_COLORS.dark,
        theme_color: APP_THEME_COLORS.dark,
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // Sem chamadas de rede em runtime: o precache do build cobre 100% offline
    }),
  ],
})
