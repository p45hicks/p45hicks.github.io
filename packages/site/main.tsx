import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppModules from './AppModules.tsx'

// App bootstrap: mount the router and the module-composition root component.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppModules />
    </BrowserRouter>
  </React.StrictMode>,
)
