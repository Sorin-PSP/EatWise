import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { FoodProvider } from './contexts/FoodContext'
import { UserProvider } from './contexts/UserContext'
import { registerSW } from './registerSW'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <FoodProvider>
          <App />
        </FoodProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// Register service worker
registerSW()
