import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Link previews (KakaoTalk, Instagram DM) need absolute OG URLs. Set SITE_URL, or let
// Vercel's production domain fill it in at build time.
const siteUrl = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '')

const ogUrls = (): Plugin => ({
  name: 'og-urls',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
})

export default defineConfig({
  plugins: [react(), tailwindcss(), ogUrls()],
})
