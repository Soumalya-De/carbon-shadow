import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CarbonShadowProvider } from './context/CarbonShadowContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarbonShadowProvider>
      <App />
    </CarbonShadowProvider>
  </StrictMode>,
)
