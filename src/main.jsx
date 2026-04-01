import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            borderRadius: '10px',
            background: '#1a1a2e',
            color: '#fff',
          },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
