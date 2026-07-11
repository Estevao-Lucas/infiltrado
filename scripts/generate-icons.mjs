/**
 * Gera os PNGs do PWA a partir do SVG fonte (public/icon.svg).
 * Uso: node scripts/generate-icons.mjs
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')
const svg = await readFile(path.join(publicDir, 'icon.svg'))

const BACKGROUND = '#0F1115'

async function generate(name, size) {
  await sharp(svg).resize(size, size).png().toFile(path.join(publicDir, name))
  console.log(`✓ ${name} (${size}x${size})`)
}

/**
 * Maskable: fundo full-bleed + símbolo reduzido para caber na safe zone
 * de 20% (conteúdo nos 80% centrais).
 */
async function generateMaskable(name, size) {
  const inner = Math.round(size * 0.8)
  const symbol = await sharp(svg).resize(inner, inner).png().toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: symbol, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, name))
  console.log(`✓ ${name} (${size}x${size}, maskable)`)
}

await generate('pwa-192.png', 192)
await generate('pwa-512.png', 512)
await generateMaskable('pwa-512-maskable.png', 512)
await generate('apple-touch-icon.png', 180)
await generate('favicon-96.png', 96)
