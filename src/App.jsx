import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root-container">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
