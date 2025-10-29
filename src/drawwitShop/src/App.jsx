import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LevelProgressBar from './ProgressBar.jsx';
import PowerItem from './PowerItem.jsx';
import inkImage from '/ink.png'
import { showToast } from '@devvit/web/client';


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

  async function spendInk(quantity) {
    try {
      const response = await fetch('/api/spend-ink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error spending ink:', data.error);
        return;
      }

      console.log('Ink updated:', data.ink);
      return data.ink;
    } catch (err) {
      console.log('Error in spendInk:', err.message);
    }
  }

  const handleBuyPower = async (powerName) => {
    try {
      const response = await fetch('/api/set-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedPower: powerName
        })
      });

      const data = await response.json();

      if (response.ok) {
        await devvitLog(`power purchased: ${data}`);
        showToast(`${powerName} purchased`);
      } else {
        await devvitLog(`Error: ${data.error}`);
        showToast(`something went wrong!`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  async function updateLastInkCheck() {
    try {
      const response = await fetch('/api/update-last-ink-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      await devvitLog(`✅ Last ink check updated for ${data.username} at ${data.lastInkCheck}`);
    } catch (error) {
      await devvitLog(`❌ Failed to update last ink check: ${error}`);
      console.error(error);
    }
  }

  async function addInk(amount) {
    try {
      const response = await fetch('/api/add-ink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }), // 👈 CAMBIO AQUÍ
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error adding ink:', data.error);
        return;
      }

      console.log('Ink updated:', data.ink);
      return data.ink;
    } catch (err) {
      console.log('Error in addInk:', err.message);
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


  useEffect(() => {
    const run = async () => {
      await devvitLog("running run()...")
      await addInk(1);
      await updateLastInkCheck();
      try {
        const ink = await fetchInk();
        setInk(ink);
        await devvitLog(`succesfully added ink every 30 second: ${ink}`);
      } catch (error) {
        await devvitLog(`error occurred while adding ink: ${error}`);
      }
    };

    const updateInk = async () => {
      try {
        const ink = await fetchInk();
        setInk(ink);
        await updateLastInkCheck();
      } catch (error) {
        await devvitLog(`error occurred while fetching ink: ${error}`);
      }
    }

    const inkInterval = setInterval(run, 30000);

    return () => {
      clearInterval(inkInterval);
    };
  }, []);

  return (
    <div className={'main-container'}>
      <div className={'shop-container'}>
        <div className={'welcome-message'}>Welcome Ibaniez !</div>
        <div className={'ink-container--header'}>
          <img src={inkImage} className={'ink-image'} />
          <p>{ink}</p>
        </div>
        <div className={'shop-father-container'}>
          <LevelProgressBar pixelsPlaced={Number(pixelsPlaced)} />
          <div style={{ height: '6px', width: '100%' }} />
          <PowerItem
            name={'pepper'}
            description={
              'Sprinkles random black dots across the canvas, giving it a gritty or speckled look. Great for mild disruption.'
            }
            price={40}
            onBuy={async () => {
              if (Number(ink) >= 40) {
                await spendInk(40);
                setInk((prevState) => prevState - 40);
                await handleBuyPower('pepper');
              } else {
                showToast('you dont have enough ink!');
              }
            }}
          />

          <PowerItem
            name={'flashlight'}
            description={
              'Floods the area with intense light, whitening all pixels.'
            }
            price={100}
            onBuy={async () => {
              if (Number(ink) >= 100) {
                await spendInk(100);
                setInk((prevState) => prevState - 100);
                await handleBuyPower('flashlight');
              } else {
                showToast('you dont have enough ink!');
              }
            }}
          />

          <PowerItem
            name={'smudge'}
            description={
              'Drags pixels slightly to create a smeared effect. Perfect for distortion.'
            }
            price={150}
            onBuy={async () => {
              if (Number(ink) >= 150) {
                await spendInk(150);
                setInk((prevState) => prevState - 150);
                await handleBuyPower('smudge');
              } else {
                showToast('you dont have enough ink!');
              }
            }}
          />

          <PowerItem
            name={'invert'}
            description={
              'Flips every color to its opposite, creating a stark negative image. A bold visual statement or total chaos.'
            }
            price={600}
            onBuy={async () => {
              if (Number(ink) >= 600) {
                await spendInk(600);
                setInk((prevState) => prevState - 600);
                await handleBuyPower('invert');
              } else {
                showToast('you dont have enough ink!');
              }
            }}
          />

          <PowerItem
            name={'mirror'}
            description={
              'Reflects one half of the canvas along y axis, instantly creating mirrored madness.'
            }
            price={1000}
            onBuy={async () => {
              if (Number(ink) >= 1000) {
                await spendInk(1000);
                setInk((prevState) => prevState - 1000);
                await handleBuyPower('mirror');
              } else {
                showToast('you dont have enough ink!');
              }
            }}
          />

          <PowerItem
            name={'blackout'}
            description={
              'Erases the canvas completely, turning it into pure black. Permanent and absolute. Use wisely.'
            }
            price={5000}
            onBuy={async () => {
              if (Number(ink) >= 5000) {
                await spendInk(5000);
                setInk((prevState) => prevState - 5000);
                await handleBuyPower('blackout');
              } else {
                showToast('you dont have enough ink!');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App
