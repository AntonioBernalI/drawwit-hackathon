import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LevelProgressBar from './ProgressBar.jsx';



function App() {
  const [pixelsPlaced, setPixelsPlaced] = useState("")
  const [ink, setInk] = useState("")

  async function devvitLog(message) {
    const response = await fetch('/api/log-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data;
  }

  async function fetchPixelsPlaced() {
    try {
      const response = await fetch('/api/get-pixels-placed', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.pixelsPlaced;
    } catch (error) {
      await devvitLog(`Failed to fetch pixels placed: ${error}`);
      throw error;
    }
  }

  async function fetchInk() {
    try {
      const response = await fetch('/api/get-ink', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.ink;
    } catch (error) {
      await devvitLog(`Failed to fetch ink: ${error}`);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pixelsPlaced = await fetchPixelsPlaced();
        const ink = await fetchInk();
        setPixelsPlaced(pixelsPlaced);
        setInk(ink);
        await devvitLog(`Pixels placed: ${pixelsPlaced}`);
        await devvitLog(`Ink available: ${ink}`);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={"main-container"}>
      <div className={"shop-container"}>
        <div className={"welcome-message"}>
          Welcome Ibaniez !
        </div>
        <LevelProgressBar pixelsPlaced={Number(pixelsPlaced)} />
      </div>
    </div>
  )
}

export default App
