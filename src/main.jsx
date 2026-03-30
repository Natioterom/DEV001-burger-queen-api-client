import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ProductContextProvider } from './components/DataContext'
import { AuthProvider } from './components/useAuth'
import './componentsCss/Menu.css'
import './componentsCss/Login.css'
import './componentsCss/Products.css'
import './componentsCss/AdminHome.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
