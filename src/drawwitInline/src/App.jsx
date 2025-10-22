import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import upvote from '/upvote.png'
import './styles/App.css'

function App() {

  const [matchHash, setMatchHash] = useState({
    prompt: "loading...",
    canvasA: null,
    canvasB: null,
    status: 'active',
    factionA: null,
    factionB: null,
    topCollaborators: null,
    totalInkSpentOnFactionA: null,
    totalInkSpentOnFactionB: null,
    votesA: '...',
    votesB: '...',
  })

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

  const fetchPostId = async () => {
    try {
      const response = await fetch('/api/get-post-id', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.postId;
    } catch (error) {
      await devvitLog(`Failed to fetch post ID:, ${error}`)
      throw error;
    }
  };

  async function fetchMatchHash(key) {
    try {
      const response = await fetch('/api/get-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const record = await response.json();
      return record;
    } catch (error) {
      await devvitLog(`an error happened while fetching matchData: ${error}`);
      throw error;
    }
  }



  useEffect(() => {
    const fetchData = async () => {
      const postId = await fetchPostId();
      const matchHash = await fetchMatchHash(postId);
      await devvitLog(JSON.stringify(matchHash));
      setMatchHash(matchHash, null, 2);
    }

    fetchData();
  }, [])


  return (
    <div className="main">
      <header className="main_drawing-name-container">
        {matchHash.prompt}
      </header>
      <div className="main_drawing--a">
        <div className="drawing-label--a">
          A
        </div>
        <div className="upvote-label--a">
          <img src={upvote} alt="Logo" className="upvote-icon" />
          <p>{matchHash.votesA}</p>
        </div>
      </div>
      <div className="main_drawing--b">
        <div className="drawing-label--b">
          B
        </div>
        <div className="upvote-label--b">
          <img src={upvote} alt="Logo" className="upvote-icon" />
          <p>{matchHash.votesB}</p>
        </div>
      </div>
    </div>
  )
}

export default App
