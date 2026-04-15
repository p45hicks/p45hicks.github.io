import type { JSX } from 'react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function Undeployed(): JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-evenly bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">I may be back.</h1>
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG1kYnpxc2poYWdyN3Juanl1NDUyYWh3ZDl2enV6cDZ3cHh0a3NveiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wh4f9iW5vCjgQ/giphy.gif" alt="Nothing to see here"/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Undeployed />
  </React.StrictMode>,
)
