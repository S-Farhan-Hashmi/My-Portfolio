import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// No <StrictMode>: it double-invokes effects, which would tear down and
// rebuild the WebGL context on every mount for no benefit.
createRoot(document.getElementById('root')!).render(<App />)
