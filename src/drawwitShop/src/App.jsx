import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LevelProgressBar from './ProgressBar.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={"main-container"}>
      <div className={"shop-container"}>
        <div className={"welcome-message"}>
          Welcome Ibaniez !
        </div>
        <LevelProgressBar pixelsPlaced={50} />
      </div>
    </div>
  )
}

export default App
