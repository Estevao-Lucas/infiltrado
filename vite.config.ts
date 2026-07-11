import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
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
  plugins: [react(), tailwindcss(), appMetadataPlugin()],
})
