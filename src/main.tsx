import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { Gallery } from './Gallery'

const q = new URLSearchParams(location.search)
const isGallery = ['gallery', 'card', 'report', 'story', 'sheet', 'og', 'icon', 'portrait'].some((k) => q.has(k))

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isGallery ? <Gallery /> : <App />}</StrictMode>,
)
