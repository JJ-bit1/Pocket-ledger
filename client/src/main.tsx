import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './ThemeContext.tsx' // <-- Import this

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider> {/* <-- Wrap App */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)