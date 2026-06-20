import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize performance monitoring and analytics (with error handling)
try {
  import('./utils/analytics').then(({ initAnalytics }) => {
    initAnalytics()
  }).catch(error => {
    console.warn('Analytics initialization skipped:', error.message)
  })
} catch (error) {
  console.warn('Analytics module not found')
}

// Register service worker for PWA support (optional - only in production)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        // Service Worker registered successfully
      })
      .catch(() => {
        // Service Worker registration skipped
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
