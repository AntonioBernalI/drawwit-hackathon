import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import upvote from '/upvote.png'
import './styles/App.css'

function App() {

  return (
    <div className="main">
      <header className="main_drawing-name-container">
        Cat
      </header>
      <div className="main_drawing--a">
        <div className="drawing-label--a">
          A
        </div>
        <div className="upvote-label--a">
          <img src={upvote} alt="Logo" className="upvote-icon" />
          <p>186</p>
        </div>
      </div>
      <div className="main_drawing--b">
        <div className="drawing-label--b">
          B
        </div>
        <div className="upvote-label--b">
          76
        </div>
      </div>
    </div>
  )
}

export default App
