import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [expiresAt, setExpiresAt] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [isFinished, setIsFinished] = useState(false)

  function getTimeLeft(isoDate) {
    const now = new Date();
    const target = new Date(isoDate);
    let diff = Math.max(0, target - now);

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}hr ${minutes}m ${seconds}s`;
  }

  async function expireMatch() {
    const response = await fetch('/api/expire-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  async function getExpiresAt() {
    try {
      const res = await fetch('/api/get-expires-at');
      if (!res.ok) {
        console.error('Failed to fetch expiration date');
        return null;
      }
      const data = await res.json();
      return data.expiresAt;
    } catch (error) {
      console.error('Error fetching expiration date:', error);
      return null;
    }
  }

  useEffect(() => {
    const setTimer = async () => {
      const expireDate = await getExpiresAt();
      if (expireDate) setExpiresAt(expireDate);
    };
    setTimer();
  }, []);


  useEffect(() => {
    if (!expiresAt || expiresAt.trim() === '') return;

    let isMounted = true;

    const expire = async () => {
      try {
        await expireMatch();
      } catch (err) {
        console.error('Error expiring', err);
      }
    };

    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft(expiresAt);
      if (!isMounted) return;

      setTimeLeft(newTimeLeft);

      if (newTimeLeft === '0d 0hr 0m 0s') {
        setIsFinished(true);
        clearInterval(interval);
        expire();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [expiresAt]);

  return (
    <div className="main-container">
      <div className={`time-container--${isFinished ? 'finished' : 'going'}`}>
        <p className="time-label">{!isFinished ? `match ends in` : "finished"}</p>
        {!isFinished && (<p className="time">{timeLeft}</p>)}
      </div>
    </div>
  );
}

export default App;
