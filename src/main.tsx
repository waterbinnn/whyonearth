import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import './index.css'
import { App } from './App'
import { Gallery } from './Gallery'

const q = new URLSearchParams(location.search)
const isGallery = ['gallery', 'card', 'report', 'story', 'og', 'icon', 'portrait'].some((k) => q.has(k))

// Vercel Web Analytics: page views for the app only, not the dev pages.
if (!isGallery) inject()

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isGallery ? <Gallery /> : <App />}</StrictMode>,
)
