import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// No StrictMode: the intro uses imperative GSAP/canvas animation and
// StrictMode's double-invoke in dev would register duplicate ScrollTriggers.
createRoot(document.getElementById('root')!).render(<App />)
