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

  const handleSpendPower = async (powerName) => {
    try {
      const response = await fetch('/api/decrement-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedPower: powerName
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await devvitLog(`power spent: ${JSON.stringify(data)}`);
        showToast(`${powerName} used`);
      } else {
        await devvitLog(`Error: ${data.error}`);
        showToast(data.error || 'something went wrong!');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

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
                await handleBuyPower('pepper');
              }else{
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
            onBuy={() => {}}
          />

          <PowerItem
            name={'smudge'}
            description={
              'Drags pixels slightly to create a smeared effect. Perfect for distortion.'
            }
            price={150}
            onBuy={() => {}}
          />

          <PowerItem
            name={'invert'}
            description={
              'Flips every color to its opposite, creating a stark negative image. A bold visual statement  or total chaos.'
            }
            price={600}
            onBuy={() => {}}
          />

          <PowerItem
            name={'mirror'}
            description={
              'Reflects one half of the canvas along y axis, instantly creating mirrored madness.'
            }
            price={1000}
            onBuy={() => {}}
          />

          <PowerItem
            name={'blackout'}
            description={
              'Erases the canvas completely, turning it into pure black. Permanent and absolute. Use wisely.'
            }
            price={5000}
            onBuy={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App
